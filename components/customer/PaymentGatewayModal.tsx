"use client";

import { useState } from "react";
import { Lock, X, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  gateway: "bkash" | "nagad" | "rocket";
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentGatewayModal({
  isOpen,
  gateway,
  amount,
  onClose,
  onSuccess
}: PaymentGatewayModalProps) {
  const [step, setStep] = useState<"account" | "otp" | "pin" | "success">("account");
  const [accountNumber, setAccountNumber] = useState("01711223344");
  const [otp, setOtp] = useState("123456");
  const [pin, setPin] = useState("12345");
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "account") {
      if (accountNumber.length >= 11) setStep("otp");
    } else if (step === "otp") {
      if (otp.length >= 4) setStep("pin");
    } else if (step === "pin") {
      if (pin.length >= 4) {
        setStep("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    }
  };

  const resetAndClose = () => {
    setStep("account");
    onClose();
  };

  // Official Brand Specs
  const brandConfig = {
    bkash: {
      name: "bKash Payment Gateway",
      logo: "💖",
      brandColor: "bg-[#E2136E] text-white",
      btnColor: "bg-[#E2136E] hover:bg-[#c40f5e] text-white",
      accentBg: "bg-pink-50 border-pink-200 text-pink-900",
      merchant: "SuperDeal E-Commerce Ltd",
      invoice: "SD-INV-9982"
    },
    nagad: {
      name: "Nagad Payment Checkout",
      logo: "🟠",
      brandColor: "bg-[#ED1C24] text-white",
      btnColor: "bg-[#ED1C24] hover:bg-[#d0151c] text-white",
      accentBg: "bg-orange-50 border-orange-200 text-orange-900",
      merchant: "SuperDeal E-Commerce Ltd",
      invoice: "SD-INV-9982"
    },
    rocket: {
      name: "Dutch-Bangla Rocket Gateway",
      logo: "🚀",
      brandColor: "bg-[#8C3494] text-white",
      btnColor: "bg-[#8C3494] hover:bg-[#73297a] text-white",
      accentBg: "bg-purple-50 border-purple-200 text-purple-900",
      merchant: "SuperDeal E-Commerce Ltd",
      invoice: "SD-INV-9982"
    }
  };

  const currentBrand = brandConfig[gateway];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 space-y-0">
        {/* Official Brand Header */}
        <div className={`${currentBrand.brandColor} p-5 space-y-3 relative`}>
          <button
            onClick={resetAndClose}
            className="btn btn-circle btn-xs bg-white/20 hover:bg-white/40 border-none text-white absolute top-3 right-3"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-white/20 backdrop-blur-md rounded-2xl">{currentBrand.logo}</span>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">{currentBrand.name}</h3>
              <p className="text-xs text-white/80">{currentBrand.merchant}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20 font-mono">
            <span>Invoice: <strong>{currentBrand.invoice}</strong></span>
            <span className="text-base font-black">৳{(amount * 120).toFixed(0)} BDT ({amount.toFixed(2)} USD)</span>
          </div>
        </div>

        {/* Gateway Body Steps */}
        <div className="p-6 space-y-5">
          {step !== "success" ? (
            <form onSubmit={handleNext} className="space-y-4">
              {/* Step 1: Account Number */}
              {step === "account" && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-2xl border text-xs ${currentBrand.accentBg}`}>
                    <p className="font-semibold">Enter your 11-digit {gateway.toUpperCase()} Account Number below to proceed with payment.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold uppercase text-slate-500">Your {gateway.toUpperCase()} Account Number</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="input input-md input-bordered font-mono font-bold text-lg text-slate-900 w-full text-center tracking-widest focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="checkbox checkbox-xs checkbox-primary"
                    />
                    <span>I agree to the terms and conditions of {gateway.toUpperCase()}</span>
                  </label>
                </div>
              )}

              {/* Step 2: Verification Code (OTP) */}
              {step === "otp" && (
                <div className="space-y-3 text-center">
                  <div className={`p-3 rounded-2xl border text-xs text-left ${currentBrand.accentBg}`}>
                    <p className="font-semibold">Enter the 6-digit verification code (OTP) sent to <strong className="font-mono">{accountNumber}</strong></p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold uppercase text-slate-500">Verification Code (OTP)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1 2 3 4 5 6"
                      className="input input-md input-bordered font-mono font-black text-xl text-slate-900 w-full text-center tracking-widest focus:outline-none"
                    />
                  </div>

                  <button type="button" onClick={() => setStep("account")} className="text-xs text-primary font-bold hover:underline">
                    Resend Code or Change Number
                  </button>
                </div>
              )}

              {/* Step 3: PIN Input */}
              {step === "pin" && (
                <div className="space-y-3 text-center">
                  <div className={`p-3 rounded-2xl border text-xs text-left ${currentBrand.accentBg}`}>
                    <p className="font-semibold">Enter your 5-digit {gateway.toUpperCase()} PIN number to confirm payment.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold uppercase text-slate-500">Enter {gateway.toUpperCase()} PIN</label>
                    <input
                      type="password"
                      required
                      maxLength={5}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="• • • • •"
                      className="input input-md input-bordered font-mono font-black text-2xl text-slate-900 w-full text-center tracking-widest focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn btn-md btn-outline border-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!agreeTerms}
                  className={`btn btn-md font-extrabold rounded-xl shadow-md ${currentBrand.btnColor}`}
                >
                  {step === "pin" ? "CONFIRM PAYMENT" : "PROCEED"}
                </button>
              </div>
            </form>
          ) : (
            /* Success Animation Screen */
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500">
                Transaction ID: <strong className="font-mono text-slate-900">TRX99882211</strong>
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl text-xs font-mono font-semibold">
                Amount Paid: ৳{(amount * 120).toFixed(0)} BDT via {gateway.toUpperCase()}
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <Lock className="w-3 h-3 text-emerald-600" /> 100% Encrypted Official {gateway.toUpperCase()} Gateway
          </div>
        </div>
      </div>
    </div>
  );
}
