import CertsSectionClient from "@/components/sections/CertsSectionClient";
import { isAdminSession } from "@/lib/admin-auth";
import { getCertsForHome } from "@/lib/certs-db";

export default async function CertsSection() {
  const { certs, persistedCertIds } = await getCertsForHome();
  const adminEditable = await isAdminSession();

  return (
    <section
      id="certs"
      aria-labelledby="certs-heading"
      className="border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-28">
        <CertsSectionClient
          headerLabel="Certs"
          titleId="certs-heading"
          title="수료 및 자격"
          description="꾸준히 배우고, 필요한 역량을 차근차근 쌓아가고 있습니다."
          certs={certs}
          persistedCertIds={[...persistedCertIds]}
          adminEditable={adminEditable}
        />
      </div>
    </section>
  );
}
