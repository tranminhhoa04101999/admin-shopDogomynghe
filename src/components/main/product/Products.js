import NavLinkCustom from '../../base/NavLinkCustom';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';

import './Product.css';
import { Outlet } from 'react-router-dom';

const Products = (props) => {
  return (
    <div className="wrap-product">
      <div className="header-product">
        <div className="header-product__btn">
          <NavLinkCustom to="showproduct" title="Hiển thị" iconName={faTabletAlt} />
        </div>
        <div className="header-product__btn">
          <NavLinkCustom to="addproduct" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Products;