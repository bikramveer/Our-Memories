'use client'
import { useRouter } from "next/navigation"
import Logo from "@/components/Logo"

export default function Support() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-teal-50">
            <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    
                    <div 
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => router.push('/login')}
                    >  
                        <Logo width={32} height={32} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Y A L B U M</h1>
                        </div>  
                    </div>
                </div>
            </header>

            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">Help & Support</h1>
                        <p className="text-lg text-gray-600">We're here to help you get the most out of YALBUM</p>
                    </div>

                    {/* Quick Links */}
                    <div className="grid md:grid-cols-3 gap-4 mb-12">
                        <a 
                            href="mailto:yalbumadmin@gmail.com"
                            className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="text-3xl mb-3">📧</div>
                            <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                            <p className="text-sm text-gray-600">yalbumadmin@gmail.com</p>
                        </a>

                        <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-xl p-6">
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="font-bold text-gray-900 mb-1">In-App Support</h3>
                            <p className="text-sm text-gray-600">Settings → Help & Support</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-xl p-6">
                            <div className="text-3xl mb-3">⚡</div>
                            <h3 className="font-bold text-gray-900 mb-1">Response Time</h3>
                            <p className="text-sm text-gray-600">Within 24-48 hours</p>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="prose prose-blue max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                            {/* FAQ Item */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I create an album?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Tap the "+" button on the Albums screen, give your album a name, and you're ready to start 
                                    uploading photos! You'll receive a unique invite code that you can share with friends and family.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I join an album?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    On the Albums screen, tap "Join Album" and enter the invite code shared with you. 
                                    You'll instantly have access to all photos in that album.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I organize photos into folders?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Yes! Inside any album, tap the "+" icon next to folders to create a new folder. 
                                    You can then upload photos directly to that folder or move existing photos into it.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I upload photos?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Open an album, tap the "Upload" button, and select photos from your device. 
                                    You can upload multiple photos at once. On mobile, HEIC photos are automatically converted to JPEG.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I download photos?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    To download a single photo, open it and tap the download icon. To download multiple photos, 
                                    long-press a photo to enter selection mode, select the photos you want, then tap the download button.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I delete photos?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    You can delete any photo you uploaded. Long-press a photo to select it, then tap the delete icon. 
                                    Note: Only the person who uploaded a photo can delete it.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Who can see my photos?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Only people you've invited to your album can see your photos. Albums are completely private 
                                    and secure. Photos are not visible to anyone outside your album, including YALBUM staff.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I leave an album?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Yes. Go to the album, tap the settings icon, and select "Leave Album." 
                                    You'll no longer have access to that album's photos.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I delete my account?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    In the app, go to Settings → Account → Delete Account. This will permanently delete your 
                                    account and all photos you've uploaded. This action cannot be undone.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">What photo formats are supported?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We support JPEG, PNG, GIF, and WebP. On mobile, HEIC photos (iPhone photos) are automatically 
                                    converted to JPEG. On web, please convert HEIC to JPEG before uploading.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a photo limit?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    You can upload as many photos as you'd like. Individual photos must be under 10MB. 
                                    We recommend keeping albums organized with folders for the best experience.
                                </p>
                            </div>
                        </section>

                        {/* Troubleshooting */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Troubleshooting</h2>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Photos won't upload</h3>
                                <p className="text-gray-700 leading-relaxed mb-2">Try these steps:</p>
                                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                    <li>Check your internet connection</li>
                                    <li>Ensure photos are under 10MB each</li>
                                    <li>Try uploading one photo at a time</li>
                                    <li>On web, make sure files are JPEG, PNG, or GIF (not HEIC)</li>
                                    <li>Close and reopen the app</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can't see photos in album</h3>
                                <p className="text-gray-700 leading-relaxed mb-2">Try these steps:</p>
                                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                    <li>Pull down to refresh the album</li>
                                    <li>Check if you're in the correct folder</li>
                                    <li>Ensure you have internet connection</li>
                                    <li>Log out and log back in</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Forgot password</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    On the login screen, tap "Forgot Password?" and enter your email address. 
                                    We'll send you a link to reset your password.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">App is crashing</h3>
                                <p className="text-gray-700 leading-relaxed mb-2">Try these steps:</p>
                                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                    <li>Force close the app and reopen it</li>
                                    <li>Restart your device</li>
                                    <li>Ensure you have the latest version of YALBUM</li>
                                    <li>If the issue persists, contact support with details about when it crashes</li>
                                </ul>
                            </div>
                        </section>

                        {/* Feature Requests */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Requests & Feedback</h2>
                            
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We love hearing from our users! If you have ideas for new features or suggestions for improvements, 
                                please email us at{' '}
                                <a href="mailto:yalbumadmin@gmail.com" className="text-blue-600 hover:text-blue-700 underline">
                                    yalbumadmin@gmail.com
                                </a>
                                {' '}with the subject line "Feature Request."
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                            
                            <p className="text-gray-700 leading-relaxed mb-6">
                                If you didn't find the answer you were looking for, we're here to help! 
                                Contact us and we'll get back to you as soon as possible.
                            </p>
                            
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Email Support</p>
                                        <a 
                                            href="mailto:yalbumadmin@gmail.com" 
                                            className="text-blue-600 hover:text-blue-700 underline"
                                        >
                                            yalbumadmin@gmail.com
                                        </a>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Response Time</p>
                                        <p className="text-gray-600">We typically respond within 24-48 hours</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-1">What to Include</p>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Your account email</li>
                                            <li>• Description of the issue</li>
                                            <li>• Device type (iPhone, Android, Web)</li>
                                            <li>• Screenshots if applicable</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Tips */}
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Quick Tips</h3>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Use folders to organize photos by date, event, or category</li>
                                <li>• Long-press photos to select multiple at once</li>
                                <li>• Pull down on any screen to refresh</li>
                                <li>• Tap a photo to view full-screen and add comments</li>
                                <li>• Download albums before trips for offline viewing</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        ← Back to YALBUM
                    </button>
                    <span className="text-gray-400 hidden sm:block">•</span>
                    <button
                        onClick={() => router.push('/privacy')}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Privacy Policy
                    </button>
                </div>
            </div>
        </main>
    )
}