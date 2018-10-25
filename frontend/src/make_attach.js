
//make the file attach
function make_attach() {
    //remove the attach box and create a new one
   /*
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
        </div>
        <div class="custom-file">
            <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
            <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
        </div>
    </div>
*/

    const div_input_group = helper.createElement('div',null, {class:'input-group mb-3'});
    const div_input_group_prepend = helper.createElement('div', null, {class:'input-group-prepend'});
    const span_input_text = helper.createElement('span','Upload',{id:'inputfilespan',class:'input-group-text'});

    div_input_group_prepend.appendChild(span_input_text);
    div_input_group.appendChild(div_input_group_prepend);


    const div_custom_file = helper.createElement('div',null, {class:'custom-file'});
    const input_file = helper.createElement('input',null,{class:'custom-file-input',id:'inputfile',type:'file', aria-describeby:'inputfilespan'});
    const label = helper.createElement('label','Choose File',{class:'custom-file-label',for:'inputfile'});

    div_custom_file.appendChild(input_file);
    div_custom_file.appendChild(label);

    div_input_group.appendChild(div_custom_file);




}
