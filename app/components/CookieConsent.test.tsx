import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CookieConsent } from './CookieConsent';
import { useCookies } from '@/utils/hooks';
import { loadScript } from '@/utils';

jest.mock('@/utils/hooks', () => {
  const actual = jest.requireActual('@/utils/hooks');
  return {
    ...actual,
    useCookies: jest.fn(),
  };
});

jest.mock('@/utils', () => ({
  loadScript: jest.fn(),
  cn: (...args: any[]) => args.join(' '),
}));

describe('CookieConsent Banner', () => {
  let mockGetCookie: jest.Mock;
  let mockSetCookie: jest.Mock;
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCookie = jest.fn();
    mockSetCookie = jest.fn();
    (useCookies as jest.Mock).mockReturnValue({
      getCookie: mockGetCookie,
      setCookie: mockSetCookie,
    });
  });

  it('on save it will load only toggled on preferences', async () => {
    render(<CookieConsent isOpen={true} onClose={mockOnClose} />);
    
    // Open Manage Cookies modal
    fireEvent.click(screen.getByText('Manage Cookies'));
    
    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    const analyticsSwitch = screen.getByRole('switch', { name: 'Analytics' });
    fireEvent.click(analyticsSwitch);
    
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockSetCookie).toHaveBeenCalledWith('essential', 'true');
      expect(mockSetCookie).toHaveBeenCalledWith('analytics', 'true');
      expect(mockSetCookie).toHaveBeenCalledWith('marketing', 'false');
      
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/essential.js');
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/analytics.js');
      expect(loadScript).not.toHaveBeenCalledWith('/app/scripts/marketing.js');
    });
  });

  it('onAcceptAll load all the scripts', async () => {
    render(<CookieConsent isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Allow Cookies'));

    await waitFor(() => {
      expect(mockSetCookie).toHaveBeenCalledWith('essential', 'true');
      expect(mockSetCookie).toHaveBeenCalledWith('marketing', 'true');
      expect(mockSetCookie).toHaveBeenCalledWith('analytics', 'true');
      
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/essential.js');
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/marketing.js');
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/analytics.js');
    });
  });

  it('onDeclineAll load only essential script', async () => {
    render(<CookieConsent isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getAllByText('Decline all')[0]);

    await waitFor(() => {
      expect(mockSetCookie).toHaveBeenCalledWith('essential', 'true');
      expect(mockSetCookie).toHaveBeenCalledWith('marketing', 'false');
      expect(mockSetCookie).toHaveBeenCalledWith('analytics', 'false');
      
      expect(loadScript).toHaveBeenCalledWith('/app/scripts/essential.js');
      expect(loadScript).not.toHaveBeenCalledWith('/app/scripts/marketing.js');
      expect(loadScript).not.toHaveBeenCalledWith('/app/scripts/analytics.js');
    });
  });
});
