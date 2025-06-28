import { Link } from 'react-router-dom';

const DeleteAccount = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link to="/" className="text-[#B83280] hover:text-pink-400 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-8 font-nunito">How to Delete Your Account</h1>
        </div>

        <div className="space-y-12">
          <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#B83280]">Account Deletion Instructions</h2>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">1. Go to your profile</h3>
                  <p className="text-gray-300">
                    Open the Convoo app and navigate to your profile by tapping on your profile 
                    picture in the bottom navigation bar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">2. Click on settings icon</h3>
                  <p className="text-gray-300">
                    Locate and tap the settings icon (gear symbol) in the top right corner of your profile screen.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">3. Scroll to the end</h3>
                  <p className="text-gray-300">
                    In the settings menu, scroll down to the bottom of the page where you'll find account management options.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">4. Click on "Delete Account"</h3>
                  <p className="text-gray-300">
                    Tap the "Delete Account" button. You'll be asked to confirm your decision and may need to enter your password.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#B83280]">What Happens to Your Data</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Data We Delete:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Your profile information (name, bio, photos)</li>
                  <li>Your conversation history</li>
                  <li>Your matches and connections</li>
                  <li>Your preferences and settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Data We Retain:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Anonymized usage data for analytics purposes</li>
                  <li>Records required for legal compliance (for up to 30 days)</li>
                </ul>
              </div>
              
              <div className="bg-[#B83280]/10 p-4 rounded-lg border border-[#B83280]/30 mt-4">
                <p className="text-gray-300">
                  <strong>Note:</strong> Account deletion is permanent and cannot be undone. 
                  If you wish to use Convoo again in the future, you'll need to create a new account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            If you have any questions about account deletion, please contact us at{' '}
            <a href="mailto:support@convoo.app" className="text-[#B83280] hover:underline">
              support@convoo.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;