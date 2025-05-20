import { useState } from "react";

import {
  RadioGroup,
  RadioRoot,
  RadioItem,
  RadioItemControl,
  RadioIndicator,
  RadioItemText,
  RadioLabel,
  RadioItemHiddenInput,
} from "@/components/ui/radio";

export function Playground() {
  const [simpleValue, setSimpleValue] = useState("react");
  const [compoundValue, setCompoundValue] = useState("horizontal");
  const [sizeValue, setSizeValue] = useState("base");

  return (
    <div className="x:flex x:flex-col x:gap-10 x:p-6">
      <section>
        <h2 className="x:mb-4 x:text-xl x:font-semibold">
          Simple RadioGroup Example
        </h2>
        <RadioGroup
          label="Select a framework"
          value={simpleValue}
          options={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "solid", label: "Solid" },
          ]}
          onValueChange={(details) => {
            if (details.value) setSimpleValue(details.value);
          }}
        />
        <div className="x:mt-2 x:text-sm x:text-muted-foreground">
          Selected: {simpleValue}
        </div>
      </section>

      <section>
        <h2 className="x:mb-4 x:text-xl x:font-semibold">
          Horizontal RadioGroup
        </h2>
        <RadioGroup
          label="Select a framework"
          orientation="horizontal"
          value={simpleValue}
          options={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "solid", label: "Solid" },
          ]}
          onValueChange={(details) => {
            if (details.value) setSimpleValue(details.value);
          }}
        />
      </section>

      <section>
        <h2 className="x:mb-4 x:text-xl x:font-semibold">
          Compound Component API
        </h2>
        <RadioRoot
          value={compoundValue}
          onValueChange={(details) => {
            if (details.value) setCompoundValue(details.value);
          }}
        >
          <RadioLabel>Layout Orientation</RadioLabel>

          <div className="x:mt-2 x:flex x:flex-col x:gap-2">
            <RadioItem value="horizontal">
              <RadioItemControl>
                <RadioIndicator />
              </RadioItemControl>
              <RadioItemText>Horizontal</RadioItemText>
              <RadioItemHiddenInput />
            </RadioItem>

            <RadioItem value="vertical">
              <RadioItemControl>
                <RadioIndicator />
              </RadioItemControl>
              <RadioItemText>Vertical</RadioItemText>
              <RadioItemHiddenInput />
            </RadioItem>
          </div>
        </RadioRoot>
        <div className="x:mt-2 x:text-sm x:text-muted-foreground">
          Selected: {compoundValue}
        </div>
      </section>

      <section>
        <h2 className="x:mb-4 x:text-xl x:font-semibold">Size Variants</h2>
        <div className="x:flex x:flex-col x:gap-6">
          <RadioRoot
            value={sizeValue}
            onValueChange={(details) => {
              if (details.value) setSizeValue(details.value);
            }}
          >
            <RadioLabel>Select a size</RadioLabel>

            <div className="x:mt-2 x:flex x:flex-col x:gap-4">
              <RadioItem value="sm" size="sm">
                <RadioItemControl size="sm">
                  <RadioIndicator size="sm" />
                </RadioItemControl>
                <RadioItemText size="sm">Small</RadioItemText>
                <RadioItemHiddenInput />
              </RadioItem>

              <RadioItem value="base" size="base">
                <RadioItemControl size="base">
                  <RadioIndicator size="base" />
                </RadioItemControl>
                <RadioItemText size="base">Base (Default)</RadioItemText>
                <RadioItemHiddenInput />
              </RadioItem>

              <RadioItem value="lg" size="lg">
                <RadioItemControl size="lg">
                  <RadioIndicator size="lg" />
                </RadioItemControl>
                <RadioItemText size="lg">Large</RadioItemText>
                <RadioItemHiddenInput />
              </RadioItem>
            </div>
          </RadioRoot>
        </div>
      </section>

      <section>
        <h2 className="x:mb-4 x:text-xl x:font-semibold">Disabled State</h2>
        <RadioGroup
          disabled
          label="Disabled RadioGroup"
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
          defaultValue="option1"
        />
      </section>
    </div>
  );
}
