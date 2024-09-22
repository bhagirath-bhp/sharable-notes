import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import SideBar from "@/components/SideBar";

const NavigationBar = () => {

  return (
    <nav className="flex items-center justify-between p-4">
      <a className="text-xl font-bold" href="#">
        Sharable Notes
      </a>

      <div className="hidden md:flex items-center">
        <ModeToggle />
      </div>

      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col p-4">
              <ModeToggle />
              <SideBar />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default NavigationBar;
