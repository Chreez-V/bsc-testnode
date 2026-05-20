// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SimpleERC20
/// @notice Token ERC-20 mintable/burnable para el BSC Casino Testnet.
///         El deployer es el owner inicial y puede acuñar tokens adicionales.
contract SimpleERC20 is ERC20, Ownable {
    uint8 private immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply,
        address owner_
    ) ERC20(name_, symbol_) Ownable(owner_) {
        _decimals = decimals_;
        _mint(owner_, initialSupply);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Acuña tokens adicionales. Solo el owner puede llamar esta función.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Quema tokens propios del caller.
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
