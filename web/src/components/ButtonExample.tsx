import { Button } from "./ui/button";

export const ButtonExample = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Primary Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button className="hover:bg-blue-dark">Hover</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Secondary Buttons</h2>
        <div className="flex gap-4">
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" className="border-blue-base">
            Hover
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">With Icons</h2>
        <div className="flex gap-4">
          <Button leftIcon={<IconPlaceholder />}>With Left Icon</Button>
          <Button rightIcon={<IconPlaceholder />}>With Right Icon</Button>
          <Button variant="secondary" leftIcon={<IconPlaceholder />}>
            Secondary
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Icon Buttons</h2>
        <div className="flex gap-4">
          <Button size="icon">
            <IconPlaceholder />
          </Button>
          <Button size="icon" className="bg-blue-dark">
            <IconPlaceholder />
          </Button>
          <Button size="icon" variant="secondary">
            <IconPlaceholder />
          </Button>
          <Button size="icon" variant="secondary" className="border-blue-base">
            <IconPlaceholder />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Placeholder for an icon
const IconPlaceholder = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <title>Icon</title>
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
