import { useState } from 'react'
import CurrencyList from 'currency-list'
import { Check, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Get all currencies from the package
const currencies = Object.keys(CurrencyList.getAll('en_US')).sort()

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export const CurrencySelector = ({ value, onValueChange, className }: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {value || 'Select currency...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((code) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue.toUpperCase())
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === code ? 'opacity-100' : 'opacity-0')}
                  />
                  {code}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
