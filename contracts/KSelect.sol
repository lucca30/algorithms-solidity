pragma solidity >=0.4.22 <0.9.0;

contract KSelect {
  uint256[] public values;


    function Soluciona(uint256 k) public returns (uint256[] memory, uint256, uint256) {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        uint256[] memory resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = quickSelect(k);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function quickSelect(uint256 k) public returns (uint256[] memory) {
      uint256 left = 0;
      uint256 right = values.length - 1;
      uint256[] memory list = new uint256[](values.length);
      uint256 pivotIndex;
      for(uint i = 0;i<values.length;i++){
        list[i] = values[i];
      }
      while(true){
          if (left == right){
            uint256[] memory response = new uint256[](values.length);
            for(uint i = 0;i<left;i++){
              response[i] = list[i];
            }
            return response;
          }
          pivotIndex = (left + right) / 2;     // Solidity has no random so we use the middle
          pivotIndex = partition(list, left, right, pivotIndex);
          if (k == pivotIndex)
          {
            uint256[] memory response = new uint256[](values.length);
            for(uint i = 0;i<k;i++){
              response[i] = list[i];
            }
            return response;
          }
          if (k < pivotIndex){
            right = pivotIndex - 1;
          }
          else{
            left = pivotIndex + 1;
          }
      }
    }

    function partition(uint256[] memory list, uint256 left, uint256 right, uint256 pivotIndex) public returns (uint256) {
      uint256 pivotValue = list[pivotIndex];
      uint256 temp = list[pivotIndex];
      list[pivotIndex] = list[right];
      list[right] = temp;
      uint256 storeIndex = left;
      for (uint256 i = left;i <=right;i++){
        if (list[i] < pivotValue){
          temp = list[storeIndex];
          list[storeIndex] = list[i];
          list[i] = temp;
          storeIndex++;
        }
      }
      temp = list[right];
      list[right] = list[storeIndex];
      list[storeIndex] = temp;
      return storeIndex;
    }


    function Insere(uint256[] memory data) public {
      for(uint i=0;i<data.length;i++){
        values.push(data[i]);
      }
    }

    function Consulta() public view returns (uint256[] memory){
      return values;
    }

}
