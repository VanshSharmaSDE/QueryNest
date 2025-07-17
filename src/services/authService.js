import { account, databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

class AuthService {
  // Store verification data in the user's profile document
  async storeVerificationData(userId, data) {
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    const verificationData = {
      ...data,
      expiryTime
    };
    
    try {
      // Check if user profile exists before storing verification data
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error(`User profile not found for userId: ${userId}. Cannot store verification data.`);
      }
      
      // Update the user profile with verification data
      await this.updateUserProfile(userId, {
        verificationData: JSON.stringify(verificationData)
      });
      
      console.log(`Verification data stored for user: ${userId}`);
    } catch (error) {
      console.error('Error storing verification data:', error);
      throw error;
    }
  }
  
  // Get verification data from user profile
  async getVerificationData(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile || !profile.verificationData) {
        return null;
      }
      
      const data = JSON.parse(profile.verificationData);
      
      // Check if expired
      if (Date.now() > data.expiryTime) {
        await this.clearVerificationData(userId);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting verification data:', error);
      return null;
    }
  }
  
  // Clear verification data from user profile
  async clearVerificationData(userId) {
    try {
      // Check if profile exists before trying to clear verification data
      const profile = await this.getUserProfile(userId);
      if (profile) {
        await this.updateUserProfile(userId, {
          verificationData: ""
        });
        console.log(`Verification data cleared for user: ${userId}`);
      } else {
        console.log(`User profile not found for userId: ${userId}, skipping verification data cleanup`);
      }
    } catch (error) {
      // Don't throw errors when clearing verification data - it's cleanup
      console.log('Could not clear verification data:', error.message);
    }
  }

  // Register new user with email and password
  async createAccount({ email, password, name }) {
    try {
      // Create account directly without checking for existing sessions
      const userAccount = await account.create(ID.unique(), email, password, name);
      
      if (userAccount) {
        // Create user profile in database
        await this.createUserProfile({
          userId: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name,
        });
        
        return userAccount;
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error("AuthService :: createAccount :: ", error);
      
      // Provide more helpful error messages
      if (error.message && error.message.includes("already exists")) {
        throw new Error("A user with this email already exists.");
      } else if (error.message && error.message.includes("missing scope")) {
        throw new Error("Permission error: Please check your Appwrite project settings.");
      } else {
        throw error;
      }
    }
  }

  // Login user - check isDeleted first, then emailVerified
  async login({ email, password }) {
    try {
      // Check if user is already logged in
      const existingUser = await this.getCurrentUser();
      if (existingUser) {
        // Check if the logged-in user matches the login credentials
        if (existingUser.email === email) {
          console.log('User already logged in with same email');
          return { $id: existingUser.$id, userId: existingUser.$id };
        } else {
          // Different user trying to login, logout first
          console.log('Different user trying to login, logging out existing session');
          await account.deleteSessions();
        }
      }
      
      // Create the session
      const session = await account.createEmailPasswordSession(email, password);
      
      // Check if user's account is deleted and email is verified
      if (session && session.userId) {
        try {
          const profile = await this.getUserProfile(session.userId);
          
          // If no profile exists, create one for this user
          if (!profile) {
            console.log(`No profile found for user ${session.userId}, creating one...`);
            const currentUser = await this.getCurrentUser();
            if (currentUser) {
              await this.createUserProfile({
                userId: currentUser.$id,
                email: currentUser.email,
                name: currentUser.name,
                emailVerified: currentUser.emailVerification || false
              });
              console.log(`Profile created for user ${session.userId}`);
            }
          } else {
            // FIRST: Check if account is marked as deleted in our DB
            if (profile.isDeleted) {
              // Log out immediately if account is deleted
              await account.deleteSessions();
              throw new Error('Your account was deleted. Please visit the "Restore Account" page to restore your account.');
            }
            
            // SECOND: Check if email is verified (only if account is not deleted)
            if (!profile.emailVerified) {
              // Account exists but email not verified
              await account.deleteSessions();
              throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
            }
          }
        } catch (profileError) {
          // If we can't get profile due to other errors, let the login proceed
          console.warn('Could not check account status:', profileError.message);
        }
      }
      
      return session;
    } catch (error) {
      console.error("AuthService :: login :: ", error);
      
      // Provide more helpful error messages
      if (error.code === 401) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message && error.message.includes('User not found')) {
        throw new Error('No account found with this email address. Please sign up first.');
      } else {
        throw error;
      }
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      return await account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }

  // Send password recovery email
  async sendPasswordRecoveryEmail(email) {
    try {
      const result = await account.createRecovery(
        email,
        `${window.location.origin}/reset-password` // URL where user will be redirected
      );
      return result;
    } catch (error) {
      console.error("AuthService :: sendPasswordRecoveryEmail :: ", error);
      
      if (error.code === 404) {
        throw new Error('No account found with this email address.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a few minutes before trying again.');
      } else {
        throw new Error('Failed to send password recovery email. Please try again.');
      }
    }
  }

  // Complete password recovery
  async completePasswordRecovery(userId, secret, password) {
    try {
      const result = await account.updateRecovery(userId, secret, password, password);
      return result;
    } catch (error) {
      console.error("AuthService :: completePasswordRecovery :: ", error);
      
      if (error.code === 401) {
        throw new Error('Invalid or expired reset link. Please request a new password reset.');
      } else if (error.message.includes('password')) {
        throw new Error('Password must be at least 8 characters long.');
      } else {
        throw new Error('Failed to reset password. Please try again.');
      }
    }
  }

  // Update user profile (for settings page)
  async updateProfile(userId, updates) {
    try {
      // Update Appwrite account if name is being changed
      if (updates.name) {
        await account.updateName(updates.name);
      }

      // Update email if provided (this will require verification)
      if (updates.email) {
        await account.updateEmail(updates.email, updates.password);
      }

      // Update password if provided
      if (updates.newPassword && updates.currentPassword) {
        await account.updatePassword(updates.newPassword, updates.currentPassword);
      }

      // Update user profile in database
      const profileUpdates = {};
      if (updates.name) profileUpdates.name = updates.name;
      if (updates.email) profileUpdates.email = updates.email;
      
      if (Object.keys(profileUpdates).length > 0) {
        await this.updateUserProfile(userId, profileUpdates);
      }

      return { success: true };
    } catch (error) {
      console.error("AuthService :: updateProfile :: ", error);
      
      if (error.code === 401) {
        throw new Error('Current password is incorrect.');
      } else if (error.message.includes('email')) {
        throw new Error('Failed to update email. The email might already be in use.');
      } else if (error.message.includes('password')) {
        throw new Error('Password must be at least 8 characters long.');
      } else {
        throw new Error('Failed to update profile. Please try again.');
      }
    }
  }

  // Check if user has active session
  async hasActiveSession() {
    try {
      const user = await account.get();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // Force logout and clear all sessions
  async forceLogout() {
    try {
      await account.deleteSessions();
      return true;
    } catch (error) {
      // Even if deletion fails, consider it logged out
      return true;
    }
  }

  // Create user profile in database
  async createUserProfile({ userId, email, name, emailVerified = false }) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        {
          email,
          name,
          password: "", // Don't store actual passwords - Appwrite handles auth separately
          emailVerified,
          emailVerifiedAt: emailVerified ? new Date().toISOString() : "",
          verificationData: "", // Initialize empty verification data field
          isDeleted: false, // Track if user account is deleted
          deletedAt: "", // Track when account was deleted
          restoredAt: "", // Track when account was restored
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      return await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
    } catch (error) {
      if (error.message?.includes('Document with the requested ID could not be found')) {
        console.warn(`User profile not found for userId: ${userId}. User may need to complete registration.`);
        return null; // Return null instead of throwing error
      }
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, data) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, userId, data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Send verification email using Appwrite's createVerification
  async sendSignupVerification(email, password, name) {
    let userAccount = null;
    
    try {
      console.log('Creating account and sending verification email');
      
      // Create new account
      const userId = ID.unique();
      userAccount = await account.create(userId, email, password, name);
      
      if (userAccount) {
        // Create user profile as unverified
        await this.createUserProfile({
          userId: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name,
          emailVerified: false,
        });
        
        // Store verification data
        await this.storeVerificationData(userAccount.$id, {
          userId: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name,
          password: password,
          isRestoring: false,
          createdAt: Date.now()
        });
        
        // Login to send verification email
        const session = await account.createEmailPasswordSession(email, password);
        
        // Send verification email using Appwrite's standard method
        const verification = await account.createVerification(
          `${window.location.origin}/verify-email`
        );
        
        // Logout to keep the account in unverified state until verification
        await account.deleteSessions();
        
        return {
          userId: userAccount.$id,
          email: userAccount.email,
          name: userAccount.name,
          verificationSent: true,
          isRestoring: false,
          message: 'Verification email sent! Please check your email and click the verification link.',
          expiryTime: Date.now() + 5 * 60 * 1000, // 5 minutes from now
          verification
        };
      }
    } catch (error) {
      console.error('Send signup verification error:', error);
      // Clean up verification data on error
      if (userAccount && userAccount.$id) {
        try {
          await this.clearVerificationData(userAccount.$id);
        } catch (cleanupError) {
          console.log('Could not clean up during error:', cleanupError.message);
        }
      }
      // Clean up session on error
      try {
        await account.deleteSessions();
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  // Verify email using Appwrite's verification system
  async verifySignupEmail(userId, secret, email = null) {
    try {
      console.log('Verifying email using Appwrite verification system');
      console.log('Verification params:', { userId, secret: secret ? 'present' : 'missing', secretLength: secret?.length });
      
      // Check if verification data still exists and is valid using userId
      const verificationData = await this.getVerificationData(userId);
      if (!verificationData) {
        throw new Error('Verification link expired. Please sign up again.');
      }
      
      // Validate the secret parameter
      if (!secret || typeof secret !== 'string' || secret.length < 10) {
        throw new Error('Invalid verification token. Please check your email for the correct verification link.');
      }
      
      // Use Appwrite's standard email verification
      const verification = await account.updateVerification(userId, secret);
      
      if (verification) {
        // Update user profile to mark as verified
        await this.updateUserProfile(userId, {
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString()
        });
        
        // Log in the user automatically after verification
        await account.createEmailPasswordSession(verificationData.email, verificationData.password);
        
        // Clear verification data ONLY after everything succeeds
        await this.clearVerificationData(userId);
        
        const message = verificationData.isRestoring 
          ? 'Account restored successfully! Welcome back to QueryNest!'
          : 'Email verified successfully! Welcome to QueryNest!';
        
        return { 
          verified: true, 
          userId: userId,
          isRestored: verificationData.isRestoring || false,
          verification,
          message: message
        };
      }
    } catch (error) {
      console.error('Verify email error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('User with the requested ID could not be found')) {
        throw new Error('This verification link is invalid. The user account may have been deleted. Please sign up again.');
      }
      
      if (error.message?.includes('Invalid token')) {
        throw new Error('This verification link is invalid or has expired. Please request a new verification email.');
      }
      
      // Special handling for already verified accounts or 401 errors
      if (error.message?.includes('verification') || error.code === 401 || error.message?.includes('401')) {
        try {
          // Check if user profile shows they're already verified
          const profile = await this.getUserProfile(userId);
          if (profile && profile.emailVerified) {
            // User is already verified, just log them in
            const verificationData = await this.getVerificationData(userId);
            if (verificationData) {
              await account.createEmailPasswordSession(verificationData.email, verificationData.password);
              await this.clearVerificationData(userId);
              
              const message = verificationData.isRestoring 
                ? 'Account restored successfully! Welcome back to QueryNest!'
                : 'Email already verified! Welcome to QueryNest!';
              
              return { 
                verified: true, 
                userId: userId,
                isRestored: verificationData.isRestoring || false,
                message: message
              };
            }
          }
        } catch (profileError) {
          console.error('Error checking profile during verification recovery:', profileError);
        }
      }
      
      throw error;
    }
  }

  // Resend verification email by userId
  async resendSignupVerificationByUserId(userId) {
    try {
      console.log('Resending verification email');
      
      // Get verification data
      const verificationData = await this.getVerificationData(userId);
      if (!verificationData) {
        throw new Error('Verification session expired. Please sign up again.');
      }
      
      // Log in temporarily to resend verification
      await account.createEmailPasswordSession(verificationData.email, verificationData.password);
      
      // Send new verification email
      const verification = await account.createVerification(
        `${window.location.origin}/verify-email`
      );
      
      // Logout again
      await account.deleteSessions();
      
      // Update verification data with new expiry time
      await this.storeVerificationData(userId, {
        ...verificationData,
        createdAt: Date.now()
      });
      
      return {
        success: true,
        message: 'New verification email sent! Please check your email.',
        expiryTime: Date.now() + 5 * 60 * 1000
      };
      
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Check verification status by userId
  async checkVerificationStatus(userId) {
    try {
      const verificationData = await this.getVerificationData(userId);
      if (!verificationData) {
        return { 
          valid: false, 
          expired: true,
          message: 'Verification session expired. Please sign up again.' 
        };
      }

      const remainingTime = verificationData.expiryTime - Date.now();
      
      if (remainingTime <= 0) {
        await this.clearVerificationData(userId);
        return { 
          valid: false, 
          expired: true,
          message: 'Verification session expired. Please sign up again.' 
        };
      }

      // Check if user has been verified by trying to get their profile
      try {
        const profile = await this.getUserProfile(userId);
        if (profile && profile.emailVerified) {
          // User has been verified externally, clean up and return success
          await this.clearVerificationData(userId);
          return {
            valid: true,
            verified: true,
            message: 'Email verification completed successfully!'
          };
        }
      } catch (error) {
        // Profile might not be accessible, continue with normal flow
      }

      return {
        valid: true,
        expired: false,
        verified: false,
        remainingTime,
        userData: {
          userId: verificationData.userId,
          email: verificationData.email,
          name: verificationData.name
        }
      };
    } catch (error) {
      console.error('Error checking verification status:', error);
      return { 
        valid: false, 
        expired: true,
        message: 'Error checking verification status. Please try again.' 
      };
    }
  }

  // Helper method to find user by email
  async findUserByEmail(email) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('email', email)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0];
      }
      
      return null;
    } catch (error) {
      console.error('Find user by email error:', error);
      return null;
    }
  }

  // Ensure user profile exists for current user
  async ensureUserProfile() {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      let profile = await this.getUserProfile(currentUser.$id);
      
      if (!profile) {
        console.log(`Creating missing profile for user ${currentUser.$id}`);
        profile = await this.createUserProfile({
          userId: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name,
          emailVerified: currentUser.emailVerification || false
        });
      }
      
      return profile;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return null;
    }
  }

  // Update user name
  async updateName(name) {
    try {
      const user = await account.updateName(name);
      return user;
    } catch (error) {
      console.error("AuthService :: updateName :: ", error);
      throw error;
    }
  }

  // Send password recovery email
  async sendPasswordRecovery(email, url = window.location.origin + '/reset-password') {
    try {
      const result = await account.createRecovery(email, url);
      return result;
    } catch (error) {
      console.error("AuthService :: sendPasswordRecovery :: ", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
