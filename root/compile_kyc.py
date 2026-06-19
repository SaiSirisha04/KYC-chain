from solcx import install_solc, set_solc_version, compile_files

install_solc('0.4.4')  # Install the required version
set_solc_version('0.4.4')  # Use it

compiled_sol = compile_files(['kyc.sol'])
print(compiled_sol)
