
import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const Admin = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-32 pb-16">
          <div className="container px-4 mx-auto">
            <AdminDashboard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
