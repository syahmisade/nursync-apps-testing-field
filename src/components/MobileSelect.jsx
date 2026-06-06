import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

export default function MobileSelect({
  value,
  options = [],
  onChange,
  placeholder = 'Select...',
  label = 'Choose an option',
  description,
  className = '',
  buttonClassName = '',
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(option => option.value === value);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex min-h-9 w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-3 py-2 text-left text-sm font-semibold text-foreground outline-none transition-colors active:scale-[0.99] ${buttonClassName} ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={selected ? 'truncate' : 'truncate text-muted-foreground'}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={15} className="flex-shrink-0 text-muted-foreground" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="mx-auto max-w-[430px] rounded-t-3xl border-border bg-background">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-base font-black text-foreground">{label}</DrawerTitle>
            {description && (
              <DrawerDescription className="text-sm text-muted-foreground">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          <div className="max-h-[58vh] overflow-y-auto px-4 pb-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {options.map(option => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted active:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {active && <Check size={17} className="flex-shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
