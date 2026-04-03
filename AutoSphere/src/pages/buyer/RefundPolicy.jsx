import { ShieldCheck, RefreshCcw, AlertCircle, Mail } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Return & Refund Policy</h1>
        <p className="text-gray-500">At AutoSphere, we want you to shop for car parts with total confidence.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCcw size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">7-Day Returns</h3>
          <p className="text-sm text-gray-500">Return any item within 7 days of delivery if it doesn't fit or is defective.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Genuine Parts</h3>
          <p className="text-sm text-gray-500">Full refund + 10% credit if a part sold as "Genuine" proves to be fake.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Damaged Items</h3>
          <p className="text-sm text-gray-500">Instant replacement for items damaged during shipping.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">1. Eligibility for Returns</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Item must be unused and in original packaging.</li>
            <li>Seals on electronic parts (ECUs, sensors) must not be broken.</li>
            <li>Proof of purchase (Order ID) is required.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">2. Non-Returnable Items</h2>
          <p className="text-gray-600">
            Fluids (Oils, Coolants), customized body kits, and electrical components once installed cannot be returned unless proven defective upon arrival.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">3. How to Request a Refund</h2>
          <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
            <Mail className="text-gray-400 mt-1" />
            <div>
              <p className="text-gray-600 mb-2">Email our support team with your Order ID and photos of the item.</p>
              <a href="mailto:support@autosphere.pk" className="text-green-600 font-bold hover:underline">support@autosphere.pk</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;