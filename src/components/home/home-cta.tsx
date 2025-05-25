"use client";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { GoMail } from "react-icons/go";
import { useState } from "react";
import { ContactModal } from "../contact/contact-modal";

function HomeCTA() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary/20 to-black/40 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("cta.new_expirence")}
          </h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            {t("cta.watch_expirence")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center align-middle">
            <Button
              className="bg-primary hover:bg-primary/90 text-foreground text-lg px-8 py-6"
              onClick={() => setIsModalOpen(true)}
            >
              <GoMail />
              {t("cta.begin_now")}
            </Button>
          </div>
        </div>
      </section>
      <ContactModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}

export default HomeCTA;
