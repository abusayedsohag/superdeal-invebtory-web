import CustomerNavbar from "@/components/customer/CustomerNavbar";
import CustomerFooter from "@/components/customer/CustomerFooter";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <CustomerNavbar />
      <main className="flex-1">
        {children}
      </main>
      <CustomerFooter />
    </div>
  );
}
