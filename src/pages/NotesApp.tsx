import { useState, useEffect } from 'react';
import NavigationBar from "@/components/NavigationBar";
import NotesView from "@/components/NotesView";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";

const NotesApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavigationBar />
      <Separator />
      <div className="h-full flex items-center justify-center">
        {loading ? <Loader /> : <NotesView />}
      </div>
    </div>
  );
};

export default NotesApp;
