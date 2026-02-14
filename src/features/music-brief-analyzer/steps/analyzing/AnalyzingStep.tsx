"use client";

import { useState } from "react";
import { Heading, Body, LoadingSplash } from "@songtradr/design-language";
import { text, SplashWrapper, Card } from "./AnalyzingStep.Parts";

export const AnalyzingStep = () => {
  const [pulsate, setPulsate] = useState(false);

  return (
    <Card>
      <SplashWrapper className={pulsate ? "pulsate" : undefined}>
        <LoadingSplash
          overlay={false}
          opaque
          onComplete={() => setPulsate(true)}
        />
      </SplashWrapper>
      <Heading variant="h2">{text.heading}</Heading>
      <Body>{text.subheading}</Body>
    </Card>
  );
};
