"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XMLDsig_1 = __importDefault(require("./XMLDsig"));
class DESign {
    constructor() {
        this.signXML = (xml, file, password) => {
            return new Promise((resolve, reject) => {
                XMLDsig_1.default.openFile(file, password);
                resolve(XMLDsig_1.default.signDocument(xml, 'DE'));
            });
        };
    }
}
exports.default = new DESign();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBNkI7QUFFN0IsTUFBTSxNQUFNO0lBQVo7UUFDSSxZQUFPLEdBQUcsQ0FBQyxHQUFXLEVBQUUsSUFBUyxFQUFFLFFBQWEsRUFBaUIsRUFBRTtZQUMvRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUNuQyxpQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzlCLE9BQU8sQ0FBRSxpQkFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUUsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVQLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQTtBQUVELGtCQUFlLElBQUksTUFBTSxFQUFFLENBQUMifQ==