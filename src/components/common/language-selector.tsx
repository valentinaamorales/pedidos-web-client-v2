import Image from 'next/image';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Avatar } from '@/components/ui/avatar';

export default function LanguageSelector() {
  return (
    <Select defaultValue="spanish">
      <SelectTrigger className="w-14 gap-1 bg-white sm:w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-14 gap-1 sm:w-[140px]">
        <SelectItem value="spanish">
          <div className="flex items-center justify-center gap-4">
            <Avatar>
              <Image
                src="/flags/sp.png"
                alt="Spanish Flag"
                width={16}
                height={16}
              />
            </Avatar>
            <span className="hidden sm:block">Español</span>
          </div>
        </SelectItem>

        <SelectItem value="english">
          <div className="flex items-center justify-center gap-4">
            <Avatar>
              <Image
                src="/flags/en.png"
                alt="English Flag"
                width={16}
                height={16}
              />
            </Avatar>
            <span className="hidden sm:block">English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
