import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './home';
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

describe('CookieConsent Banner in HomePage', () => {
  let mockGetCookie: jest.Mock;
  let mockSetCookie: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCookie = jest.fn();
    mockSetCookie = jest.fn();
    (useCookies as jest.Mock).mockReturnValue({
      getCookie: mockGetCookie,
      setCookie: mockSetCookie,
    });
  });

  it('if essential cookie is "true" banner wont be shown', async () => {
    mockGetCookie.mockResolvedValue({ value: 'true' });
    render(<Home />);

    await waitFor(() => {
      expect(mockGetCookie).toHaveBeenCalledWith('essential');
    });

    expect(screen.queryByText('We use cookies')).not.toBeInTheDocument();
  });

  it('If cookie is not set banner will be shown', async () => {
    mockGetCookie.mockResolvedValue(null);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('We use cookies')).toBeInTheDocument();
    });
  });

  it('on save it will load only toggled on preferences', async () => {
    mockGetCookie.mockResolvedValue(null);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Manage Cookies')).toBeInTheDocument();
    });

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
    mockGetCookie.mockResolvedValue(null);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Allow Cookies')).toBeInTheDocument();
    });

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
    mockGetCookie.mockResolvedValue(null);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByText('Decline all')[0]).toBeInTheDocument();
    });

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
