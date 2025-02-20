import type React from "react";

import { VerticalPage } from "@/components/vertical-page";
import { MetadataManager } from "@/lib/metadata-manager";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container";

import type { Metadata } from "next";

const NotFound: React.FC = async () => {
  const t = await getTranslations("common");

  return (
    <Container>
      <VerticalPage items={t("not-found").split(" ")} title={"404"} />
    </Container>
  );
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("common");

  return MetadataManager.generate(t("not-found"), "404");
};

export default NotFound;
