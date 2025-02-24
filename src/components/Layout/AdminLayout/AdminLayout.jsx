import React from 'react';

const AdminLayout = ({children}) => {
    return (
        <div className="d-flex">
            <div>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;
