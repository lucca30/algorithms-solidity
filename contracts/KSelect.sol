pragma solidity >=0.4.22 <0.9.0;

contract KSelect {
  uint256[] public values;
  mapping(uint256 => uint256) valuesCount;

    function Soluciona(uint256 k) public returns (uint256[] memory, uint256, uint256) {
        uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
        uint256[] memory resultado;
        uint256 gasAntesDaFuncao = gasleft();
        resultado = quickSelect(k);
        uint256 gasUsado = gasAntesDaFuncao - gasleft();
        return (resultado, gasUsado, consumoInicial);
    }

    function quickSelect(uint256 k) private returns (uint256[] memory) {
      uint256 left = 0;
      uint256 right = values.length - 1;
      uint256[] memory list = new uint256[](values.length);
      uint256 pivotIndex;
      for(uint i = 0;i<values.length;i++){
        list[i] = values[i];
      }
      while(true){
          if (left == right){
            uint256[] memory response = new uint256[](left);
            for(uint i = 0;i<left;i++){
              response[i] = list[i];
            }
            return response;
          }
          pivotIndex = (left + right) / 2;     // Solidity has no random so we use the middle
          pivotIndex = partition(list, left, right, pivotIndex);
          if (k == pivotIndex)
          {
            uint256[] memory response = new uint256[](k);
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

    function partition(uint256[] memory list, uint256 left, uint256 right, uint256 pivotIndex) private returns (uint256) {
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


    function InsereSemContador(uint256[] memory data) public {
      for(uint i=0;i<data.length;i++){
        values.push(data[i]);
      }
    }

    function Insere(uint256[] memory data) public {
      for(uint i=0;i<data.length;i++){
        values.push(data[i]);
        valuesCount[data[i]]++;
      }
    }



    function Consulta() public view returns (uint256[] memory){
      return values;
    }
    
    function Verifica(uint256 k,uint256[] memory y) public returns (uint256[] memory,uint256,uint256) {
      uint256 consumoInicial = block.gaslimit - gasleft() - 21000;
      uint256[] memory resultado;
      uint256 gasAntesDaFuncao = gasleft();
      resultado = verificaQuickSelect(k,y);
      uint256 gasUsado = gasAntesDaFuncao - gasleft();
      return (resultado, gasUsado, consumoInicial);
    }

    function verificaQuickSelect(uint256 k,uint256[] memory y) private returns (uint256[] memory) {
      require(k == y.length, "Invalid lenght"); // check size

      // check is sorted
      for(uint i=1;i<y.length;i++){
        require(y[i] >= y[i-1], "Not sorted");
      }

      // check all values less than k-th are on y
      uint256 kThSmaller = y[y.length - 1];
      for(uint i=0;i<values.length;i++){
        if(values[i] < kThSmaller){
          require(binarySearch(y, values[i]), "Value not found in input list");
        }
      }

      // check the number of occurrences are equal for values less the k-th
      uint256 count = 0;
      uint256 kThSmallerCount = 1;
      for(uint i=0;i<y.length;i++){
        if(y[i] == kThSmaller)
        {
          kThSmallerCount = y.length - i;
          break;
        }
        count++;
        if(y[i] != y[i+1])
        {
          require(count == valuesCount[y[i]], "Count not valid");
          count = 0;
        }
      }

      // check the number of occurrences are less or equal for the k-th
      require(kThSmallerCount <= valuesCount[kThSmaller], "Count not valid 2");
      return y;
    }

    function binarySearch(uint256[] memory y, uint256 value) private returns (bool){
      uint256 low = 0;
      uint256 high = y.length - 1;
      uint256 mid;
      while(low != high){
        mid = (low + high)/2;
        if (value == y[mid]){
            return true;
        }
        else if (value > y[mid]) // x is on the right side
        {
          low = mid + 1;
        } 
        else
        {
          high = mid - 1;
        }
      }

      if(value == y[low]){
        return true;
      }
      return false;
    }

}
