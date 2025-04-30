"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";

function HomeFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/30 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/CS2Bits-logo.png"
              alt="CS2 Gameplay"
              width={50}
              height={50}
            />
            <p className="text-foreground/60">{t("footer.description")}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4"> {t("footer.links")}</h4>
            <ul className="space-y-2 text-foreground/60">
              <li>
                <Link
                  href="/streamers-guide"
                  className="hover:text-foreground transition"
                >
                  {t("footer.streamers_guide")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-foreground/60">
              <li>
                <Link
                  href="/legal/terms-of-use"
                  className="hover:text-foreground transition"
                >
                  {t("footer.terms_of_use")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-foreground transition"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="hover:text-foreground transition"
                >
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-foreground/60">
              <li>contat@csbits.com</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Link
                href="#"
                className="text-foreground/60 hover:text-foreground transition"
              >
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>
        <div className=" border-t border-border/30 mt-8 pt-8 flex items-center justify-center text-foreground/40 text-sm">
          <p className="mr-2">{t("footer.brand")}</p>
          <Image
            src="/steam_long.png"
            alt="Steam logo"
            width={120}
            height={120}
          />
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
