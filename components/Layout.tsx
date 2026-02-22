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
    router.replace("/");
  }

  return (
    <>
      <header className="header">
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <div className="inner">

          <Link href="/" className="brand">
            <span className="dark">Type</span>
            <span className="gold">Teaw</span>
            <span className="dark">Thai</span>
          </Link>

          <div className="desktopMenu">
            {user && (
              <Link href="/history" className="navLink">
                {t("history")}
              </Link>
            )}

            {user ? (
              <>
                <span className="email">{user.email}</span>

              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="primaryBtn"
              >
                {t("login")}
              </button>
            )}

            <div className="langSwitch" onClick={toggle}>
              <span className={lang === "th" ? "active" : ""}>TH</span>
              <span className={lang === "en" ? "active" : ""}>EN</span>
            </div>
          </div>

          <div className="mobileIcons">

            <div className="langSwitch" onClick={toggle}>
              <span className={lang === "th" ? "active" : ""}>TH</span>
              <span className={lang === "en" ? "active" : ""}>EN</span>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className="menuBtn"
            >
              ☰
            </button>

            {user && (
              <button
                onClick={onLogout}
                className="iconBtn"
                title="Logout"
              >
                <img src="/images/exit.png" alt="logout" className="iconImg" />
              </button>
            )}

          </div>
        </div>

        {open && (
          <div className="mobileMenu">
            {user && (
              <Link href="/history" className="navLink">
                {t("history")}
              </Link>
            )}

            {user ? (
              <span className="email">{user.email}</span>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setOpen(false);
                }}
                className="primaryBtn small"
              >
                {t("login")}
              </button>
            )}
          </div>
        )}
      </header>

      <main className="main">{children}</main>

      {/* ✅ Login Modal อยู่ตรงนี้ที่เดียว */}
      {!user && showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <style jsx>{`
        .header {
          background: #EFE6D8;
          border-bottom: 1px solid #E0D5C3;
          padding: 14px 20px;
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

        .inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
  font-size: 44px;
  font-weight: 600;
  letter-spacing: 1px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
  font-family: "Playfair Display", serif;
}

        .brand .dark { color: #2F2F2F; }
        .brand .gold { color: #B07A3A; }

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

        .mobileMenu {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #E0D5C3;
          display: flex;
          flex-direction: column;
          gap: 14px;
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