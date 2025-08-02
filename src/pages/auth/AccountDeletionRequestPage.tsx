import React, { useState } from "react";
import {
  Heart,
  User,
  Mail,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";

interface DeletionFormData {
  email: string;
  confirmEmail: string;
  reason: string;
  additionalComments: string;
  confirmUnderstanding: boolean;
  confirmBackup: boolean;
  confirmIrreversible: boolean;
}

const AccountDeletionRequestPage: React.FC = () => {
  const [formData, setFormData] = useState<DeletionFormData>({
    email: "",
    confirmEmail: "",
    reason: "",
    additionalComments: "",
    confirmUnderstanding: false,
    confirmBackup: false,
    confirmIrreversible: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [_submitError, setSubmitError] = useState("");

  const reasonOptions = [
    { value: "not_using", label: "I don't use this service anymore" },
    { value: "privacy", label: "I have privacy concerns" },
    { value: "switching", label: "I'm switching to a different service" },
    { value: "difficult", label: "I find the service difficult to use" },
    { value: "cost", label: "Cost is a concern for me" },
    { value: "features", label: "Missing features I need" },
    { value: "other", label: "Other reason" },
  ];

  const steps = ["Before You Go", "Tell Us More", "Final Steps"];

  const handleInputChange = (field: keyof DeletionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return (
          formData.email !== "" &&
          formData.confirmEmail !== "" &&
          formData.reason !== ""
        );
      case 2:
        return (
          formData.confirmUnderstanding &&
          formData.confirmBackup &&
          formData.confirmIrreversible
        );
      default:
        return false;
    }
  };

  const allStepsValid = (): boolean => {
    return (
      formData.email === formData.confirmEmail &&
      formData.email !== "" &&
      formData.reason !== "" &&
      formData.confirmUnderstanding &&
      formData.confirmBackup &&
      formData.confirmIrreversible
    );
  };

  const handleSubmit = () => {
    if (allStepsValid()) {
      setShowConfirmModal(true);
    }
  };

  const confirmDeletion = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Create the deletion request document
      const deletionRequest = {
        email: formData.email,
        reason: formData.reason,
        additionalComments: formData.additionalComments,
        requestedAt: serverTimestamp(),
        status: "pending",
        processingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        ipAddress: null, // You might want to capture this on the backend for security
        userAgent: navigator.userAgent,
        confirmations: {
          understanding: formData.confirmUnderstanding,
          backup: formData.confirmBackup,
          irreversible: formData.confirmIrreversible,
        },
      };

      // Save to Firebase
      const docRef = await addDoc(
        collection(db, "accountDeletionRequests"),
        deletionRequest
      );
      console.log("Account deletion request saved with ID:", docRef.id);

      setIsSubmitted(true);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error saving deletion request:", error);
      setSubmitError(
        "There was an error submitting your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-green-200">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            We've Received Your Request
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Thank you for letting us know. We're sorry to see you go! Your
            account deletion request is being processed and you'll hear from us
            within 5-7 business days.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📧 We've sent a confirmation email to{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Changed your mind? You can still contact our support team within the
            next 7 days to cancel this request.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                We're sorry to see you go!
              </h3>
              <p className="text-gray-600 text-lg">
                Before you delete your account, let us help you explore other
                options.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4 text-lg">
                💡 Have you tried these alternatives?
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Pause your account instead
                    </p>
                    <p className="text-blue-700 text-sm">
                      Take a break without losing your data
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Contact our support team
                    </p>
                    <p className="text-blue-700 text-sm">
                      We're here to help resolve any issues
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Adjust your privacy settings
                    </p>
                    <p className="text-blue-700 text-sm">
                      Customize what data you share
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  → Contact Support Instead
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Just so you know...
              </h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Deleting your account will permanently remove all your data,
                including your profile, saved preferences, and any content
                you've created. This action cannot be undone, and you'll need to
                create a new account if you want to use our service again.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                What you'll lose:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "👤 Your profile and settings",
                  "📁 All your saved content",
                  "🔒 Premium features access",
                  "📊 Your usage history",
                  "🎯 Personalized recommendations",
                  "💬 Your conversations and messages",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="mr-2">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Help us improve
              </h3>
              <p className="text-gray-600">
                Your feedback helps us create a better experience for everyone.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your email address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                {formData.email !== "" && !formData.email.includes("@") && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm your email address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.confirmEmail}
                    onChange={(e) =>
                      handleInputChange("confirmEmail", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your email address"
                  />
                </div>
                {formData.confirmEmail !== "" &&
                  formData.email !== formData.confirmEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      Email addresses don't match
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your main reason for leaving? *
                </label>
                <select
                  required
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Please select a reason</option>
                  {reasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is there anything else you'd like us to know? (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.additionalComments}
                  onChange={(e) =>
                    handleInputChange("additionalComments", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your feedback helps us improve our service for others..."
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💭 <strong>Your privacy matters:</strong> This information will
                only be used to improve our service and will be deleted along
                with your account.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Final confirmation
              </h3>
              <p className="text-gray-600">
                Please confirm you understand what will happen when we delete
                your account.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.confirmUnderstanding}
                  onChange={(e) =>
                    handleInputChange("confirmUnderstanding", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>I understand this is permanent.</strong> Once deleted,
                  my account and all data cannot be recovered, and I'll need to
                  create a new account to use this service again.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.confirmBackup}
                  onChange={(e) =>
                    handleInputChange("confirmBackup", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>I've saved what I need.</strong> I have backed up or
                  saved any important information I want to keep from my
                  account.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.confirmIrreversible}
                  onChange={(e) =>
                    handleInputChange("confirmIrreversible", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>I'm sure about this decision.</strong> I want to
                  permanently delete my account and understand this action
                  cannot be undone.
                </span>
              </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">
                  What happens next?
                </span>
              </div>
              <div className="text-sm text-green-800 space-y-1">
                <p>• We'll send you a confirmation email right away</p>
                <p>• Your account will be scheduled for deletion</p>
                <p>• You have 7 days to change your mind (contact support)</p>
                <p>• After 7 days, your data will be permanently removed</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {steps[currentStep]} ({currentStep + 1} of {steps.length})
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-96 mb-8">{renderStepContent()}</div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-3">
                <button
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!isStepValid(currentStep)}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!allStepsValid()}
                    onClick={handleSubmit}
                  >
                    Submit Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  One final check
                </h3>
                <p className="text-gray-600">
                  We want to make sure this is really what you want to do.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800 text-sm leading-relaxed">
                  <strong>Ready to delete your account?</strong> This will
                  permanently remove all your data. We'll miss you, but we
                  understand if you need to go.
                </p>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  Account:{" "}
                  <strong className="text-gray-900">{formData.email}</strong>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Let me think about it
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={confirmDeletion}
                >
                  Yes, delete my account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDeletionRequestPage;
