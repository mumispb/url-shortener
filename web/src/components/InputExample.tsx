import { useState } from "react";
import { Input } from "./ui/input";

export const InputExample = () => {
  const [activeInput, setActiveInput] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("Text");
  const [value4, setValue4] = useState("Text");
  const [value5, setValue5] = useState("Text");

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="space-y-8">
        <h2 className="text-lg font-bold">Empty Inputs</h2>

        {/* Empty / Default */}
        <div>
          <Input
            label="TÍTULO"
            placeholder="Placeholder"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            onFocus={() => setActiveInput("input1")}
            onBlur={() => setActiveInput("")}
          />
          <div className="mt-2 text-gray-400">EMPTY / DEFAULT</div>
        </div>

        {/* Empty / Active */}
        <div>
          <Input
            label="TÍTULO"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            onFocus={() => setActiveInput("input2")}
            onBlur={() => setActiveInput("")}
            state={activeInput === "input2" ? "active" : "default"}
          />
          <div className="mt-2 text-gray-400">EMPTY / ACTIVE</div>
        </div>

        {/* Empty / Error */}
        <div>
          <Input label="TÍTULO" value="" state="error" error="Error message" />
          <div className="mt-2 text-gray-400">EMPTY / ERROR</div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-lg font-bold">Filled Inputs</h2>

        {/* Filled / Default */}
        <div>
          <Input
            label="TÍTULO"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
            onFocus={() => setActiveInput("input3")}
            onBlur={() => setActiveInput("")}
          />
          <div className="mt-2 text-gray-400">FILLED / DEFAULT</div>
        </div>

        {/* Filled / Active */}
        <div>
          <Input
            label="TÍTULO"
            value={value4}
            onChange={(e) => setValue4(e.target.value)}
            onFocus={() => setActiveInput("input4")}
            onBlur={() => setActiveInput("")}
            state={activeInput === "input4" ? "active" : "default"}
          />
          <div className="mt-2 text-gray-400">FILLED / ACTIVE</div>
        </div>

        {/* Filled / Error */}
        <div>
          <Input
            label="TÍTULO"
            value={value5}
            onChange={(e) => setValue5(e.target.value)}
            state="error"
            error="Error message"
          />
          <div className="mt-2 text-gray-400">FILLED / ERROR</div>
        </div>
      </div>
    </div>
  );
};
