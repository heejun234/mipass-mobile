import Header from '@/components/ui/Header';

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div className='mt-4'>{children}</div>
    </div>
  );
};

export default OrganizationLayout;
