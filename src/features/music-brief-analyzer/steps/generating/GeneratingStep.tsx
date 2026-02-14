"use client";

import { Heading, Body, LoadingSplash } from "@songtradr/design-language";
import { text, SplashWrapper, Card } from "./GeneratingStep.Parts";
import { useState } from "react";

export const GeneratingStep = () => {
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
