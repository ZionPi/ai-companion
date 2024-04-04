import React, { useState } from 'react';

const ContextMenu = ({ onDelete }) => {
  return (
    <div className="absolute bg-white shadow-lg rounded-md p-2">
      <ul>
        <li
          className="cursor-pointer hover:bg-gray-100 p-2"
          onClick={onDelete}
        >
          删除
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;