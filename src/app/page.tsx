import { Upload, Calendar, Mail, CheckCircle } from 'lucide-react';
import FileUploadForm from './components/FileUploadForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Vehicle Document Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your vehicle document management with automated expiry notifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-indigo-100">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Easy Upload</h3>
                  <p className="text-gray-600">Simply upload your Excel file containing vehicle details</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Tracking</h3>
                  <p className="text-gray-600">Select a month to check upcoming document expirations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Notifications</h3>
                  <p className="text-gray-600">Receive detailed email reports for expiring documents</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-indigo-100">
            <FileUploadForm />
          </div>
        </div>

        <div className="bg-indigo-600/5 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Our System?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">Automated Document Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">Customizable Email Reports</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">Easy Excel Integration</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">Proactive Expiry Management</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}