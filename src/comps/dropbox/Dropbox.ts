import {
    Component,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    Output
} from "@angular/core";
import {LocalStorage} from "../../services/LocalStorage";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {TreeNode} from "primeng/primeng";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'Dropbox',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './Dropbox.html',
    styleUrls: ['./Dropbox.css'],
})

export class Dropbox extends Compbaser {
    constructor(private _http: Http, private localStorage: LocalStorage, private cd: ChangeDetectorRef) {
        super();
        if (this.localStorage.getItem('dropbox_key')) {
            this.token = this.localStorage.getItem('dropbox_key');
            this.renderTree();
        }
    }

    @Output()
    onFileLinkSelected: EventEmitter<Object> = new EventEmitter<Object>();

    private selectedFile: TreeNode;
    private files = [];
    private nodes = []
    private token;
    private accountValidity: boolean = false;

    private nodeUnselect(event) {
        console.log({
            severity: 'info',
            summary: 'Node Unselected',
            detail: event.node.label
        });
    }

    private nodeSelect(event) {
        this.loadFiles(event.node.path);
    }

    private onTokenChange(event) {
        if (event.target.value.length < 20)
            return;
        this.localStorage.setItem('dropbox_key', event.target.value);
        this.renderTree();
    }

    private refreshTree() {
        this.nodes = [];
        this.files = [];
        this.renderTree();
    }

    private onAddResource(f) {
        this.loadFile(f.fileName.file);
    }

    private loadFiles(i_path) {
        this.files = [];
        const url = `https://secure.digitalsignage.com/DropboxFiles/${this.token}${i_path}`;
        return this._http.get(url)
            .catch((err) => {
                return Observable.throw(err);
            })
            .finally(() => {
            })
            .map((result: any) => {
                var f = result.json();
                f.forEach((fileName) => {
                    this.files.push({
                        path: i_path,
                        fileName: fileName,
                        fileRoot: StringJS(fileName.file).fileTailName(1).s
                    });
                })
                this.cd.markForCheck();
            }).subscribe();
    }

    private loadFile(i_path) {
        this.onFileLinkSelected.emit({link: `https://secure.digitalsignage.com/DropboxFileLink/${this.token}${i_path}`});
        this.cd.markForCheck();

        // const url = `https://secure.digitalsignage.com/DropboxFileLink/${this.token}${i_path}`;
        // f.link = `https://secure.digitalsignage.com/DropboxFileLink/${this.token}${i_path}`;
        //
        // return this._http.get(url)
        //     .catch((err) => {
        //         return Observable.throw(err);
        //     })
        //     .finally(() => {
        //     })
        //     .map((result: any) => {
        //         var f = result.json();
        //         f.link = `https://secure.digitalsignage.com/DropboxFileLink/${this.token}${i_path}`;
        //         this.onFileLinkSelected.emit(f);
        //         this.cd.markForCheck();
        //     }).subscribe();
    }

    private renderTree(i_folder: {} = {
        name: '',
        path: '/'
    }, i_start: boolean = true) {
        this.checkToken((status) => {
            if (!status)
                return;
            var url = `https://secure.digitalsignage.com/DropboxFolders/${this.token}${i_folder['path']}`;
            this._http.get(url)
                .catch((err) => {
                    return Observable.throw(err);
                })
                .finally(() => {
                })
                .map((result: any) => {
                    if (i_start)
                        this.nodes = [];
                    var folders: Array<string> = result.json();
                    folders.forEach((folder, idx) => {
                        var o = Object.create(null, {});
                        o.name = folder.replace(/\//, '');
                        o.path = folder;
                        o.label = StringJS(o.name).fileTailName(1).s;
                        if (i_start) {
                            this.nodes.push(o);
                        } else {
                            if (!i_folder['children'])
                                i_folder['children'] = [];
                            o.name = StringJS(o.name).fileTailName(1).s;
                            i_folder['children'].push(o);
                        }
                        this.renderTree(o, false);
                    })
                    this.cd.markForCheck();
                }).subscribe();
        });
    }

    private checkToken(i_cb) {
        const url = `https://secure.digitalsignage.com/DropboxAccountInfo/${this.token}`
        this._http.get(url)
            .catch((err) => {
                this.updateAccountValidity(false);
                i_cb(false);
                return Observable.throw(err);
            })
            .finally(() => {
            })
            .map((result: any) => {
                var reply: any = result.json();
                if (reply.uid) {
                    this.updateAccountValidity(true);
                    i_cb(true);
                } else {
                    this.updateAccountValidity(false);
                    i_cb(false);
                }
            }).subscribe();
    }

    private updateAccountValidity(i_value) {
        this.accountValidity = i_value;
        if (!i_value)
            this.files = [];
        this.cd.markForCheck();
    }
}

