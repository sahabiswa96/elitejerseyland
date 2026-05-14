type DashboardStatCardProps = {
  title: string;
  value: string;
};

export default function DashboardStatCard({
  title,
  value,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-[24px] border border-[rgba(201,149,0,0.14)] bg-white p-5 shadow-[0_12px_28px_rgba(201,149,0,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a6641]">
        {title}
      </p>
      <h3 className="mt-3 text-3xl font-bold text-[#2b2112]">{value}</h3>
    </div>
  );
}