pragma solidity ^0.5.11;

import "./interfaces/ICToken.sol";
import "./interfaces/IERC20.sol";

library Dispatcher {

    function openFunding(address _sender, address _token, address _endpoint, uint256 _amount) public {

        if(_token == address(0)) {

           ICToken gateway = ICToken(_endpoint);
           require(gateway.mint() == 0, 'Error: minting cTokens');

        } else {

            IERC20 token = IERC20(_token);
            ICToken gateway = ICToken(_endpoint);

            require(token.transferFrom(_sender, address(this), _amount), 'Error transfer tokens');
            require(token.approve(_endpoint, _amount), 'failed to approve token');
            require(gateway.mint(_amount) == 0, 'failed to mint ctokens');
        }
    }


    function withdraw(address _sender, address _token, address _endpoint, uint256 _amount) public {

        if(_token == address(0)) {

            ICToken gateway = ICToken(_endpoint);
            require(gateway.redeemUnderlying(_amount) == 0, "Error; compound redeemUnderlying");

        } else {

            ICToken gateway = ICToken(_endpoint);
            IERC20 token = IERC20(_token);
            require(gateway.redeem(_amount) == 0, "Error: compound reddem");
            require(token.approve(_sender, _amount) == true, "Error: Token Approve");
        }
    }

}

