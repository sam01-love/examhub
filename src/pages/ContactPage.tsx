import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    examTarget: 'JAMB',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black uppercase text-xs tracking-widest border border-slate-900">
          <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
          <span>Candidate Support Helpline</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">Contact EXAMHUB</h1>
        <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider max-w-2xl">
          Have questions regarding JAMB registration, WAEC timetables, or OAU Post-UTME screening? Our candidate support team is here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white border-2 border-slate-900 flex items-center justify-center font-black">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-base">Phone & WhatsApp</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">+234 (0) 803 123 4567</p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">+234 (0) 812 987 6543</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white border-2 border-slate-900 flex items-center justify-center font-black">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-base">Email Support</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">support@examhub.ng</p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">admissions@examhub.ng</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-base">Location</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              Obafemi Awolowo University (OAU), Ile-Ife, Osun State, Nigeria.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-6">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-400 text-slate-950 border-4 border-slate-900 flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <CheckCircle2 className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Message Sent Successfully!</h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 max-w-md mx-auto uppercase tracking-wider">
                Thank you for reaching out to EXAMHUB. An academic support counselor will respond to your query within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Send Us a Direct Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Okonjo"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david@example.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08012345678"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                    Target Examination
                  </label>
                  <select
                    value={formData.examTarget}
                    onChange={(e) => setFormData({ ...formData, examTarget: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="JAMB">JAMB UTME</option>
                    <option value="WAEC">WAEC SSCE</option>
                    <option value="POST_UTME">OAU Post-UTME</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                  Your Inquiry / Feedback
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe what you need help with (e.g. CBT subscription, subject syllabus, OAU screening cut-off)..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
