import { SessionStorageService } from "src/app/shared/services/session-storage/session-storage.service";
import { StringManipulation } from "./string_manipulation";
import { SESSION_KEY } from "./session_storage_enum";

export class Utils {
  constructor(private session_storage: SessionStorageService){}

  static returnFreqOfPayment(value: string):string {
    if (value === null || value===undefined || value.trim().length === 0) {
      return null;
    } else if (value.trim().toLowerCase()==="m") {
      return "Monthly";
    }
    else if (value.trim().toLowerCase()==="w") {
      return "Weekly";
    }
    else if (value.trim().toLowerCase()==="y") {
      return "Yearly";
    }
    return null;

  }

  static trackByCode(index=0, item=null) {
    return item?.code;
  }
  static trackById(index=0, item=null) {
    return item?.id;
  }


  public getClientCode(){
    let data = StringManipulation.returnNullIfEmpty( this.session_storage.get(SESSION_KEY.QUOTE_DETAILS) );
    return data===null?null:data['client_code'];
  }

  public getQuoteCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    return quote_code===null?null:quote_code['quote_code'];  
  }

  public getProposalCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    return quote_code===null?null:quote_code['proposal_code'];  
  }

  public getTelQuoteCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    return quote_code===null?null:quote_code['quote_no'];  
  }

  public getWebQuoteCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS));
    return quote_code===null?null:quote_code['code'];  
  }

  public getEndrCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    return quote_code?quote_code?.endr_code:null;  
  }

  public getPolCode(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    return quote_code?quote_code?.pol_code:null;  
  }

  public isTelQuoteOrWebQuote(type='TEL'){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    if(quote_code&&type==='TEL'&&quote_code['quick_quote_code']) return true;
    if(quote_code&&type==='WEB'&&quote_code['web_quote_code']) return false;
    if(type==='NEW') return true;
    return false;
  }

  public returnTelQuoteOrWebQuote(){
    let quote_code = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS));
    return quote_code['page'];
  }

}
