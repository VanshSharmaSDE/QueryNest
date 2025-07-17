const Privacy = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: January 16, 2025</p>
        </div>

        <div className="card space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              QueryNest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              AI-powered platform and services. Please read this privacy policy carefully. If you do not 
              agree with the terms of this privacy policy, please do not access the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <p className="text-gray-300 mb-4">We may collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              <li>Name and email address (for account creation)</li>
              <li>Profile information you choose to provide</li>
              <li>Communications you send to us</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Usage Information</h3>
            <p className="text-gray-300 mb-4">We automatically collect certain information about your use of our services:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              <li>Chat conversations and messages</li>
              <li>Custom datasets you upload</li>
              <li>Usage patterns and preferences</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Uploaded Content</h3>
            <p className="text-gray-300">
              When you upload custom datasets or documents to train your AI assistant, we store and 
              process this content to provide personalized responses. This content remains private 
              to your account and is not shared with other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process your custom datasets to generate AI responses</li>
              <li>Communicate with you about our services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns to improve user experience</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium mb-3">Third-Party Services</h3>
            <p className="text-gray-300 mb-4">
              We use third-party services to help us operate our platform:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              <li><strong>Appwrite:</strong> For backend services, database, and user authentication</li>
              <li><strong>OpenRouter:</strong> For AI model access and processing your queries</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">We Do Not Sell Your Data</h3>
            <p className="text-gray-300 mb-4">
              We do not sell, trade, or rent your personal information to third parties. Your custom 
              datasets and chat conversations remain private and are not shared with other users or 
              used for purposes other than providing you with personalized AI responses.
            </p>

            <h3 className="text-xl font-medium mb-3">Legal Requirements</h3>
            <p className="text-gray-300">
              We may disclose your information if required to do so by law or in response to valid 
              requests by public authorities (e.g., a court or a government agency).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure data centers and infrastructure</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this Privacy Policy. You may request deletion 
              of your account and associated data at any time through your account settings or by 
              contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Access and review your personal information</li>
              <li>Update or correct your account information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
              <li>Request clarification about our data practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="text-gray-300">
              We use cookies and similar tracking technologies to enhance your experience on our 
              platform. These technologies help us remember your preferences, maintain your login 
              session, and analyze how you use our services. You can control cookie settings 
              through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries other than your 
              country of residence. We ensure that such transfers are subject to appropriate 
              safeguards and comply with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-300">
              Our services are not intended for children under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date. Your continued use of our services after any modifications 
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300">
                <strong>Email:</strong> privacy@querynest.com<br />
                <strong>Address:</strong> 123 Innovation Drive, Tech Valley, CA 94025<br />
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
