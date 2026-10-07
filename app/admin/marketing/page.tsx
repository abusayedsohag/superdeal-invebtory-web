import { Megaphone, Plus, Mail, Share2, TrendingUp, Users, Target } from "lucide-react";

export default function AdminMarketingPage() {
  const campaigns = [
    { title: "Diwali & Autumn Mega Flash Sale", platform: "Meta Ads (FB & IG)", reach: "45,000 Users", conversion: "3.4%", spend: "\$800.00", status: "Active", badgeColor: "badge-success" },
    { title: "Weekly VIP Email Newsletter", platform: "Email Campaign", reach: "12,400 Subscribers", conversion: "5.1%", spend: "\$50.00", status: "Active", badgeColor: "badge-success" },
    { title: "New Season Launch Push Notice", platform: "Web Push Notification", reach: "8,900 Users", conversion: "2.8%", spend: "\$0.00", status: "Completed", badgeColor: "badge-neutral" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Marketing & Campaigns</h1>
          <p className="text-xs text-slate-500">Manage promo campaigns, ad spend, customer reach, and email blasts</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((c, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{c.title}</h3>
                <span className="text-xs text-slate-500 font-semibold">{c.platform}</span>
              </div>
              <span className={`badge ${c.badgeColor} text-white font-bold text-xs`}>{c.status}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
              <p className="flex justify-between"><span>Audience Reach:</span> <strong className="text-slate-900">{c.reach}</strong></p>
              <p className="flex justify-between"><span>Conversion Rate:</span> <strong className="text-emerald-600 font-bold">{c.conversion}</strong></p>
              <p className="flex justify-between"><span>Budget Spent:</span> <strong className="text-slate-900">{c.spend}</strong></p>
            </div>

            <button className="btn btn-xs btn-outline btn-primary btn-block">View Campaign Analytics</button>
          </div>
        ))}
      </div>
    </div>
  );
}
