import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";
import LoginModal from "@/components/loginmodal"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { t, lang, toggle } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  async function onLogout() {
    await signOut();
    setShowLogin(false);
  }

  return (
    <>
      <header className="header">
        <div className="inner">

          <div className="brandBlock">
            <Link href="/" className="brand">
              <span className="dark">Type</span>
              <span className="gold">Teaw</span>
              <span className="dark">Thai</span>
            </Link>
          </div>

          <div className="rightSide">
            <div className="langSwitch" onClick={toggle}>
              <span className={lang === "th" ? "active" : ""}>TH</span>
              <span className={lang === "en" ? "active" : ""}>EN</span>
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(!open)}
                className="menuBtn"
              >
                ☰
              </button>

              {open && (
                <div className="mobileMenuBox">

                  {user && (
                    <span className="menuEmail">
                      {user.email}
                    </span>
                  )}

                  <Link href="/" passHref legacyBehavior>
                    <a className="menuItem" onClick={() => setOpen(false)}>
                      <div className="iconWrap">
                        <img src="/images/home.png" className="menuIcon" />
                      </div>
                      <span>{lang === "th" ? "หน้าแรก" : "Home"}</span>
                    </a>
                  </Link>

                  {user && (
                    <Link href="/history" passHref legacyBehavior>
                      <a className="menuItem" onClick={() => setOpen(false)}>
                        <div className="iconWrap">
                          <img src="/images/history.png" className="menuIcon" />
                        </div>
                        <span>{lang === "th" ? "ประวัติ" : "History"}</span>
                      </a>
                    </Link>
                  )}

                  {user && (
                    <>
                      <div className="divider" />

                      <button
                        onClick={() => {
                          onLogout();
                          setOpen(false);
                        }}
                        className="menuItemBtn logoutItem"
                      >
                        <div className="iconWrap">
                          <img src="/images/exit.png" className="menuIcon" />
                        </div>
                        <span>{lang === "th" ? "ออกจากระบบ" : "Logout"}</span>
                      </button>
                    </>
                  )}

                  {!user && (
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setOpen(false);
                      }}
                      className="menuItemBtn"
                    >
                      <div className="iconWrap">
                        <img src="/images/enter.png" className="menuIcon" />
                      </div>
                      <span>{t("login")}</span>
                    </button>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      </header >

      <main className="main">{children}</main>

      {/* ✅ Login Modal อยู่ตรงนี้ที่เดียว */}
      {
        !user && showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )
      }

      <style jsx>{`
        .header {
          background: #EFE6D8;
          border-bottom: 1px solid #E0D5C3;
          padding: 14px 20px;
        }

        .menuIcon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.divider {
  height: 1px;
  background: #E2D6C7;
  margin: 6px 4px;
}

.logoutItem span {
  color: #9C3B2E;
}

        .iconBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.iconImg {
  width: 18px;
  height: 18px;
  object-fit: contain;
  transition: all 0.2s ease;
}

.iconImg:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
  
.menuText {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.menuTitle {
  font-weight: 500;
}

.menuEmail {
  font-size: 11px;
  color: #9A8B7C;
  margin-top: 3px;
}

.menuItem,
.menuItemBtn {
  display: flex !important;
  align-items: center;
  flex-direction: row !important;

  gap: 12px;
  padding: 12px 16px;
  width: 100%;

  border-radius: 14px;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
}
  .menuItem {
  box-sizing: border-box;
}

.menuItem span,
.menuItemBtn span {
  display: inline-block;
}

.menuItem:hover,
.menuItemBtn:hover {
  background: rgba(176, 122, 58, 0.08);
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.iconSlot {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #D9C7B5;
  flex-shrink: 0;
}

        .inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brandBlock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  gap: 4px;
}

.rightSide {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

        .brand {
  font-size: 60px;
  font-weight: 600;
  letter-spacing: 3px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
  font-family: "Playfair Display", serif;
}

        .brand .dark { color: #2F2F2F; }
        .brand .gold {
  color: #B07A3A;
  letter-spacing: 2px;
}

        .desktopMenu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navLink {
  text-decoration: none;
  color: #5C3A21;
  font-size: 14px;
  position: relative;
  transition: color 0.2s ease;
}

.navLink::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0%;
  height: 1px;
  background: #7B4B2A;
  transition: width 0.25s ease;
}

.navLink:hover {
  color: #7B4B2A;
}

.navLink:hover::after {
  width: 100%;
}

.mobileMenu .navLink {
  font-weight: 500;
  font-size: 15px;
}

        .email {
          font-size: 12px;
          color: #7A5C45;
        }

        .primaryBtn {
          background: #7B4B2A;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primaryBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.15);
        }

        .primaryBtn.small {
          width: fit-content;
        }
          .emailUnder {
  font-size: 10px;
  color: #9A8B7C;     /* 👈 จางขึ้น */
  margin-top: 6px;
  padding-left: 2px;  /* 👈 เยื้องนิดนึง */
  opacity: 0.8;
}

        .langSwitch {
          display: flex;
          background: #E8D8C3;
          border-radius: 999px;
          padding: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .langSwitch span {
          padding: 4px 10px;
          border-radius: 999px;
          color: #7A5C45;
          transition: all 0.2s ease;
        }

        .langSwitch span.active {
          background: #7B4B2A;
          color: white;
        }

        .mobileIcons {
          display: none;
          align-items: center;
          gap: 12px;
        }

        .menuBtn {
          background: none;
          border: none;
          font-size: 22px;
          color: #5C3A21;
          cursor: pointer;
        }

        .mobileMenuBox {
  position: absolute;
  right: 0;
  top: 44px;

  min-width: 260px;
  padding: 12px;

  border-radius: 18px;

  background: #EFE6D8;
  border: 1px solid #E0D5C3;
  box-shadow: 0 24px 50px rgba(0,0,0,0.08);

  display: flex;
  flex-direction: column;
  gap: 6px;

  z-index: 100;
}

.iconWrap {
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menuIcon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

        .main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px 18px;
        }

        @media (max-width: 768px) {
          .desktopMenu { display: none; }
          .mobileIcons { display: flex; }
        }
      `}</style>
    </>
  );
}