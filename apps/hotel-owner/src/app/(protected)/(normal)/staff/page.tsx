import dynamic from 'next/dynamic';

const StaffOperationsTable = dynamic(
  () => import('../../../../features/staff/components/StaffOperationsTable'),
  { ssr: false }
);

export default function StaffPage() {
  return (
    <div className="h-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StaffOperationsTable />
    </div>
  );
}
