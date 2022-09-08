import React from 'react'
import { useRouter } from "next/router";
import { Divider } from '@mui/material';
import Text from '../Text';

const UserMenuItem = ({ item, id, onClick, startBorder }) => {
    const router = useRouter();
  
    const isFirstItem = id == 0;
  
    return (
      <>
        {isFirstItem && startBorder ? <Divider className="mt-1" /> : <></>}
        <div
          onClick={() => {
            if (item.href) {
              router.push(item.href);
            }
            onClick && onClick();
          }}
          className={`flex items-center my-1 p-3 space-x-2 text-primaryText dark:text-primaryTextDark hover:bg-slate-100 dark:hover:bg-backgroundV1Dark cursor-pointer`}
        >
          <item.icon
            fontSize="small"
            className="text-gray-500 dark:text-secondaryDark"
          />
          <Text>{item.name}</Text>
        </div>
      </>
    );
  };

export default UserMenuItem