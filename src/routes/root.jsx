import { useState } from "react";

export default function Root() {
   //user insert
   const [address, setAddress] = useState();
   const [netmask, setNetmask] = useState();
   //calculated in ip
   const [networkIDIpFormat, setNetworkIDIpFormat] = useState();
   const [netmaskIpFormat, setNetmaskIpFormat] = useState();
   const [broadcastIpFormat, setBroadcastIpFormat] = useState();
   //binary values
   const [binaryAddress, setBinaryAddress] = useState();
   const [networkIDBinFormat, setNetworkIDBinFormat] = useState();
   const [binaryNetmask, setBinaryNetmask] = useState();
   const [binaryBroadcastFormat, setBinaryBroadcastFormat] = useState();

   const calcuate = () => {
      const netIBin = networkIdBinaryCalculation(binaryAddress, binaryNetmask);
      const broadBin = broadcastBinaryCalculation(binaryAddress, binaryNetmask);
      setNetworkIDBinFormat(netIBin);
      setNetworkIDIpFormat(parsingBinaryToIp(netIBin));
      setBinaryBroadcastFormat(broadBin);
      setBroadcastIpFormat(parsingBinaryToIp(broadBin));
   }

   function parsingIpToBinary(number) {
      const arrOfStrings = number.split(".")
      let result = "";
      for (let i = 0; i < arrOfStrings.length; i++) {
         let binaryPart = parseInt(arrOfStrings[i]).toString(2);
         if (binaryPart.length != 8) {
            for (let i = 8 - binaryPart.length; i > 0; i--) {
               binaryPart = "0".concat(binaryPart);
            }
         }
         result = result.concat(binaryPart);
         if (arrOfStrings.length > 1 && i < arrOfStrings.length - 1) {
            result = result.concat(".");
         }
      }
      return result;
   }

   function parsingNetmaskToBinary(number) {
      let result = "";
      for (let i = 1, j = number; i < 33; i++, j--) {
         if (j > 0) {
            result = result.concat("1");
         } else {
            result = result.concat("0");
         }
         if (i % 8 === 0 && i < 30) {
            result = result.concat(".");
         }
      }
      return result;
   }

   function parsingBinaryToIp(binaryIp) {
      const arrOfBinaries = binaryIp.split(".")
      let result = "";
      result = result.concat(
         arrOfBinaries.map(bin => parseInt(bin, 2))
            .join('.')
      );
      return result;
   }

   function networkIdBinaryCalculation(binaryAddressIp, binaryNMIp) {
      let result = "";
      for (let i = 0; i < binaryAddressIp.length; i++) {
         if (binaryAddressIp.charAt(i) != '.') {
            result = result.concat(
               binaryAddressIp.charAt(i) & binaryNMIp.charAt(i)
            );
         } else {
            result = result.concat('.');
         }
      }

      return result;
   }
   function broadcastBinaryCalculation(binaryAddressIp, binaryNMIp) {
      let result = "";
      const inverseBinaryNetmask = inverseBinaryCalc(binaryNMIp);
      for (let i = 0; i < binaryAddressIp.length; i++) {
         if (binaryAddressIp.charAt(i) != '.') {
            result = result.concat(
               binaryAddressIp.charAt(i) | inverseBinaryNetmask.charAt(i)
            );
         } else {
            result = result.concat('.');
         }
      }

      return result;
   }
   function inverseBinaryCalc(binary) {
      let result = "";
      for (let i = 0; i < binary.length; i++) {
         if (binary.charAt(i) != '.') {
            if (binary.charAt(i) === '0') {
               result = result.concat('1');
            } else if (binary.charAt(i) === '1') {
               result = result.concat('0');
            }

         } else {
            result = result.concat('.');
         }
      }
      return result;
   }
   const handleNetmaskChange = (e) => {
      setNetmask(e.target.value);
      const binNetMask = parsingNetmaskToBinary(e.target.value);
      setBinaryNetmask(binNetMask);
      setNetmaskIpFormat(parsingBinaryToIp(binNetMask));
   };
   const handleAddressChange = (e) => {
      setAddress(e.target.value);
      setBinaryAddress(parsingIpToBinary(e.target.value));
   };
   return (
      <>
         <div id="topBar">
            <h1>Ip Calculator</h1>
            <div id="searchZone">
               <input
                  id="ip"
                  aria-label="Search contacts"
                  placeholder="Ip"
                  type="search"
                  name="ip"
                  onChange={handleAddressChange}
               />
               <input
                  id="netmask"
                  aria-label="Search contacts"
                  placeholder="/Netmask"
                  type="search"
                  name="netmask"
                  onChange={handleNetmaskChange}
               />

            </div>
         </div>
         <div id="detail">


            <dl>
               <dt>Address:</dt>
               <dd>{address ? address : "192.168.0.1"}: </dd>
               <dd>{binaryAddress ? binaryAddress : "00001010.00010010.00110011.00010111"}
               </dd>

               <dt> Netmask:</dt>
               <dd>{netmask ? netmaskIpFormat : "255.255.255.0"}: </dd>
               <dd>{binaryNetmask ? binaryNetmask : "11111111.11111111.11111110.00000000"} </dd>
            </dl>
            <button type="button"
               onClick={calcuate}
            >Calculate</button>
            <dl>
               <dt>Network Id: </dt>
               <dd>{networkIDIpFormat ? networkIDIpFormat : "10.18.50.0"} </dd>
               <dd>{networkIDBinFormat ? networkIDBinFormat : "00001010.00010010.00110010.00000000"}</dd>

               <dt>Broadcast: </dt>
               <dd>{broadcastIpFormat ? broadcastIpFormat : "10.18.51.255"}</dd>
               <dd>{binaryBroadcastFormat ? binaryBroadcastFormat : "00001010.00010010.00110011.11111111"}</dd>
            </dl>
         </div>
      </>
   );
}