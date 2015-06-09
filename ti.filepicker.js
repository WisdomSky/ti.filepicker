


function TRD(globalize){
    var _TRD_ = {};
    _TRD_.version = "1.0";
   
    _TRD_.createFilePickerDialog = function(){
      
        var picker = {};
        picker._con_dialog = null;
        picker._list_view = null;
        picker._header_view = null;
        picker._pwd = null;
        picker._callback_complete = null;
        picker._callback_change = null;
        
        picker.createDialog = function(){
                picker._callback_complete = function(){};
                picker._callback_change = function(){};
                picker._header_view = Ti.UI.createLabel({
                    width: Ti.UI.FILL,
                    height: 30,
                    text: "...",
                    font: {
                        fontSize: 15,
                        fontWeight: "bold"
                    }
                });
                
                picker._header_view.addEventListener("click",function(){
                    var p = Ti.Filesystem.getFile(picker._pwd).getParent();
                    if(p!=null)
                     picker.setPath(p.nativePath);
                });
                
                // create list view
                picker._list_view = Ti.UI.createListView({
                    width: 999999,
                    height: 999999,
                    headerView: picker._header_view // assign custom header view
                });
                
                // add item click handler
                picker._list_view.addEventListener("itemclick",function(e){
                    var section = picker._list_view.sections[0];
                    var item = section.getItemAt(e.itemIndex);
        
                    if(Ti.Filesystem.getFile(picker._pwd,item.properties.title).isDirectory()){
                        picker.setPath(Ti.Filesystem.getFile(picker._pwd,item.properties.title).nativePath);
                    } else {
                        picker._con_dialog.hide();
                        picker._callback_complete({
                            file: Ti.Filesystem.getFile(picker._pwd,item.properties.title),
                            type: "complete",
                            source: e.source   
                        }); 
                    }
                    
                });
                
                if(OS_ANDROID){
                    if(Ti.Filesystem.isExternalStoragePresent()){
                        picker.setPath(Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory).getParent().nativePath);
                    } else {
                        picker.setPath("file:///");
                    }
                }
                
        
             
                // create dialog
                picker._con_dialog = Ti.UI.createAlertDialog({
                    width: 999999,
                    height: 999999,
                    androidView: picker._list_view, // assign list view to dialog
                    title: "Select file..."
                });
                
                return picker;
                                             
         };
        
        picker.addEventListener = function(event,callback){
            switch(event){
                case "complete": 
                    picker._callback_complete = callback;
                break;
                case "change":
                    picker._callback_change = callback;
                break;
                default:
            }
            return picker;
        };
        picker.setPath = function(path){
            var ext_dir = Ti.Filesystem.getFile(path);
            
            if(!ext_dir.exists() || !ext_dir.isDirectory())
                return;
            // create section
            var list_section = Ti.UI.createListSection();
            
            // process get external directory
            
            picker._pwd = ext_dir.nativePath;
            var dir_conts = ext_dir.getDirectoryListing();
            var items = [];
            
            // process items
            for(var i=0;i<dir_conts.length;i++)items.push({properties: { title: dir_conts[i]}});
            
            // assign items
            list_section.setItems(items);
             // assign data
            picker._list_view.sections = [list_section];   
            return picker;
        };
                                         
        picker.setGoUpText = function(text){
            picker._header_view.text = text;
        };            
        picker.setTitle = function(text){
            picker._con_dialog.setTitle(text);
            return picker;
        };                               
        picker.show = function(){
           picker._con_dialog.show(); 
        };
        
        return picker.createDialog();
    };  
        
        Ti.TRD = _TRD_;
        return _TRD_;
}

module.exports = TRD;