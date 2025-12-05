import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';

describe('Navbar', () => {
  it('shows processing badge when active', () => {
    render(
      <Navbar
        userName="Tester"
        onLogout={() => {}}
        onOpenNotifications={() => {}}
        hasUnread={false}
        processing
        processLabel="Running job"
      />,
    );
    expect(screen.getByText(/running job/i)).toBeInTheDocument();
  });
});
