import { useCookies } from "@/utils/hooks";
import { loadScript } from "@/utils";
import { Button } from "@ui/Button";
import { Modal, ModalStack } from "@ui/Modal";
import Toggle from "@ui/Toggle";
import { useState } from "react";

export const CookieConsent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isManageCookiesOpen, setIsManageCookiesOpen] =
    useState<boolean>(false);
  const [essentials, setEssentials] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  const { setCookie } = useCookies();

  const loadScripts = ({
    marketing,
    analytics,
  }: {
    marketing: boolean;
    analytics: boolean;
  }) => {
    loadScript("/app/scripts/essential.js");
    if (marketing) {
      loadScript("/app/scripts/marketing.js");
    }
    if (analytics) {
      loadScript("/app/scripts/analytics.js");
    }
  };

  const onSave = async () => {
    setCookie("essential", "true");

    setCookie("analytics", String(analytics));
    setCookie("marketing", String(marketing));
    loadScripts({ marketing, analytics });

    setIsManageCookiesOpen(false);
  };

  const onAcceptAll = async () => {
    await setCookie("essential", "true");
    await setCookie("marketing", "true");
    await setCookie("analytics", "true");
    loadScripts({ marketing: true, analytics: true });

    onClose();
  };

  const onDeclineAll = async () => {
    await setCookie("essential", "true");
    await setCookie("marketing", "false");
    await setCookie("analytics", "false");
    loadScripts({ marketing: false, analytics: false });

    onClose();
  };

  return (
    <ModalStack>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={false}
        closeOnClickOutside={false}
        className="fixed bottom-0 flex"
      >
        <Modal.Header className="w-full lg:max-w-[80%]">
          We use cookies
        </Modal.Header>
        <Modal.Body className="lg:max-w-[80%]">
          We use cookies to enhance your browsing experience and improve our
          website's performance. By continuing to use this site, you consent to
          the use of cookies. To learn more about how we use cookies and your
          options, please read our cookie policy.
        </Modal.Body>
        <Modal.Footer className="lg:max-w-[80%] grid grid-cols-1 w-full gap-3 lg:grid-cols-[auto_1fr_auto_auto] ">
          {({ onClose }) => (
            <>
              <Button
                className="lg:col-start-3"
                intent="primary"
                onClick={onAcceptAll}
              >
                Allow Cookies
              </Button>
              <Button
                className="lg:col-start-4"
                intent="secondary"
                onClick={() => {
                  setIsManageCookiesOpen(true);
                }}
              >
                Manage Cookies
              </Button>
              <Button
                className="lg:col-start-1 md:row-start-1"
                intent="tertiary"
                onClick={onDeclineAll}
              >
                Decline all
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        isOpen={isManageCookiesOpen}
        onClose={() => {
          setIsManageCookiesOpen(false);
        }}
        size="sm"
      >
        <Modal.Body className="grid grid-cols-1 gap-4">
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] w-full">
              <h2>Essentials</h2>{" "}
              <Toggle checked={essentials} disabled aria-label="Essentials" className="col-start-3" />
            </div>
            <p>
              These cookies are essential for the proper functioning of our
              services and cannot be disabled.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] w-full">
              <h2>Analytics</h2>{" "}
              <Toggle
                checked={analytics}
                aria-label="Analytics"
                className="col-start-3"
                onChange={(checked) => {
                  setAnalytics(checked);
                }}
              />
            </div>
            <p>
              These cookies collect information about how you use our services
              or potential errors you encounter. Based on this information we
              are able to improve your experience and react to any issues.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-[auto_1fr_auto] w-full">
              <h2>Marketing</h2>{" "}
              <Toggle
                checked={marketing}
                aria-label="Marketing"
                className="col-start-3"
                onChange={(checked) => {
                  setMarketing(checked);
                }}
              />
            </div>
            <p>
              These cookies allow us to show you advertisements relevant to you
              through our advertising partners.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="grid grid-cols-2 gap-3 w-full mt-2">
          {({ onClose }) => (
            <>
              <Button
                intent="primary"
                onClick={() => {
                  onAcceptAll();
                  onClose();
                }}
              >
                Accept All
              </Button>
              <Button intent="secondary" onClick={() => {
                onSave();
                onClose()
              }}>
                Save
              </Button>
              <Button
                className="col-span-2"
                intent="tertiary"
                onClick={() => {
                  onDeclineAll();
                  onClose();
                }}
              >
                Decline all
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </ModalStack>
  );
};
