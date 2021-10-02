"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XMLDsig_1 = __importDefault(require("./XMLDsig"));
class DESign {
    constructor() {
        this.signXML = (file, password, xml, tag) => {
            return new Promise((resolve, reject) => {
                XMLDsig_1.default.openFile(file, password);
                resolve(XMLDsig_1.default.signDocument(xml, tag));
            });
        };
    }
}
exports.default = new DESign();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBNkI7QUFFN0IsTUFBTSxNQUFNO0lBQVo7UUFDSSxZQUFPLEdBQUcsQ0FBQyxJQUFTLEVBQUUsUUFBYSxFQUFFLEdBQVcsRUFBRSxHQUFRLEVBQWlCLEVBQUU7WUFDekUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDbkMsaUJBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QixPQUFPLENBQUUsaUJBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUE7SUFDTCxDQUFDO0NBQUE7QUFFRCxrQkFBZSxJQUFJLE1BQU0sRUFBRSxDQUFDIn0=