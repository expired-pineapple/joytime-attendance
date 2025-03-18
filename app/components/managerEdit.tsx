import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PiSpinner } from "react-icons/pi";
import { BsCheck2Circle } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from 'axios'; 


interface Props {
  id: string;
  sheetOpen: boolean;
  onChange: (value: boolean) => void;
  onSuccess: () => Promise<void>
}

const ManagerEditForm: React.FC<Props> = ({ id, sheetOpen, onChange, onSuccess }) => {
  const [editformData, setEditformData] = useState({
    user: {
      employeeNumber: "",
      name: "",
    },
    formula: ""
  });

  const [editFetchLoading, setEditFetchLoading] = useState(true);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const { toast } = useToast();

  const fetchEmployeeDataByID = async (id: string) => {
    try {
      setEditFetchLoading(true);
      const res = await axios.get(`/api/employee/${id}`);
      if (res.status === 200) {
        setEditformData(res.data);
      } else if (res.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast({
        description: "Failed to fetch employee data",
        className:"top-0 right-0 bg-red-50 text-red-900 border-red-900",
      });
    } finally {
      setEditFetchLoading(false);
    }
  };

  const editUserData = async () => {
    setEditLoading(true);
    toast({
      description: (
        <>
          <div className="flex items-center justify-center">
                        <PiSpinner className="h-4 w-4 mr-2 animate-spin" />
                        <p>Loading</p>
          </div>
        </>
      ),
      className:
        "top-0 right-0 bg-blue-50 text-blue-900 border-blue-900",
    });

    try {
      if (id !== "") {
        const res = await axios.put(`/api/employee/${id}`, {
          ...editformData,
          user: {
            ...editformData.user,
          },
        });
        if (res.status === 200) {
          setEditSuccess(true);
          toast({
            description: res.data.message,
            className:
              "top-0 right-0 bg-emerald-50 text-emerald-900 border-emerald-900",
          });
          onSuccess();
          setTimeout(() => {
            setEditSuccess(false);
          }, 3000);
        }
      }
    } catch (error: any) {
      toast({
        description: "Failed to update user data",
        className:"top-0 right-0 bg-red-50 text-red-900 border-red-900",
      });
    } finally {
      setEditLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchEmployeeDataByID(id);
    }
  }, [id]);

  const renderInput = (id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={editFetchLoading ? "Loading..." : `Enter ${label}`}
        className="col-span-3"
        disabled={editFetchLoading}
        value={value}
        onChange={onChange}
      />
    </div>
  );

  return (
    <Sheet open={sheetOpen} onOpenChange={onChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Manager</SheetTitle>
          <SheetDescription>
            Edit selected manager in the system
          </SheetDescription>
        </SheetHeader>
        {editSuccess && (
          <div className="border border-emerald-100 p-2 w-full mx-auto rounded-md bg-emerald-50/50 mt-2 text-emerald-700 flex items-center gap-4 justify-center">
            <BsCheck2Circle />
            <p>Manager edited successfully</p>
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); editUserData(); }}>
          <div className="grid gap-4 py-4">
            {renderInput("employeeNumber", "Employee Number", editformData.user.employeeNumber, 
              (e) => setEditformData({...editformData, user: {  ...editformData.user, employeeNumber: e.target.value} }))
            }
            {renderInput("name", "Name", editformData.user?.name || "", 
              (e) => setEditformData({ ...editformData, user: { ...editformData.user, name: e.target.value } }))
            }
           
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" disabled={editLoading || editFetchLoading}>
                {editLoading ? (
                  <div className="flex items-center justify-center">
                    <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                    <p>Saving...</p>
                  </div>
                ) : (
                  <p>Save</p>
                )}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ManagerEditForm;