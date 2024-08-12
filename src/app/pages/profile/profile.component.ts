import {Component, OnInit} from '@angular/core';
import {SelectItem, TreeNode} from 'primeng/api';
import {ProfileService} from '@services/template/profile.service';
import {AuthService} from '@services/auth.service';
import {MensajeService} from '@app/error/mensaje.service';
import {
    ProfileModel,
    ProfileModelRequestSingle,
    ProfileModelResponseSingle,
    ProfileModelResponseList,
    ProfileModelRequestList
} from '@app/model/profile';
import {AccessModel, AccessModelRequest} from '@app/model/access';
import {AccessService} from '@services/access.service';
import {TranslateService} from '@ngx-translate/core';
import {RequestHeaderModel} from '@app/model/requestHeader.model';
import {CONFIG} from '@config/config';
import {ItemsModel} from '@models/util';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    rowsTables: number;
    list: ProfileModel[];
    entity: ProfileModel;
    entitySelect: ProfileModel;
    displayDialog: boolean;
    isView: boolean;
    submitted = false;
    access: TreeNode[];
    selectedAccess: TreeNode[];
    modelAccess: AccessModel;
    loading: boolean;
    protected companyId: number;
    // Filters
    companiesDropDownList: Array<SelectItem>;

    // Filters

    constructor(
        private profileService: ProfileService,
        private authService: AuthService,
        private accessService: AccessService,
        private translate: TranslateService,
        private mensajeService: MensajeService
    ) {
        this.initModels();
    }

    initModels() {
        this.rowsTables = Number(CONFIG.ROWS_TABLE);
        this.list = [];
        this.entity = new ProfileModel();
        this.entitySelect = new ProfileModel();
        this.displayDialog = false;
        this.isView = false;
        this.submitted = false;
        this.access = [];
        this.selectedAccess = [];
        this.loading = false;
        this.modelAccess = new AccessModel();
        this.companyId = this.authService.getCompanyId();
        this.companiesDropDownList = new Array<SelectItem>();
    }

    ngOnInit() {
        this.listAccess();
        this.onList();
    }

    protected onList() {
        this.loading = true;
        this.list = [];
        const header = new RequestHeaderModel(this.authService.getUser());
        const profileDto = new ProfileModel();
        const profileModel1: ProfileModelRequestList = new ProfileModelRequestList(header, profileDto);

        this.profileService.list(profileModel1).subscribe({
            next: (data: ProfileModelResponseList) => {
                this.loading = false;
                this.list = data.profiles;
            },
            error: error => {
                this.loading = false;
            }
        });
    }

    private find(entyProfile: ProfileModel) {
        this.submitted = true;
        this.entity = null;
        const header = new RequestHeaderModel(this.authService.getUser());
        const profileModel1 = new ProfileModelRequestSingle(header, entyProfile);

        this.profileService.find(profileModel1).subscribe({
            next: (data: ProfileModelResponseSingle) => {
                this.submitted = false;
                this.entity = data.profile;
                this.loadSelectAcces(this.access, this.entity.list);
                this.displayDialog = true;
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    private listAccess() {
        const header = new RequestHeaderModel(this.authService.getUser());
        const requestModel = new AccessModelRequest(header, new AccessModel());
        this.accessService.list(requestModel).subscribe({
            next: (data: any) => {
                const list = data.list;
                this.accessToTreeNodes(list);
            },
            error: error => {
                this.submitted = false;
            }
        });
    }

    showDialogToAdd() {
        this.isView = false;
        this.entity = new ProfileModel();
        this.selectedAccess = [];
        this.loadSelectAcces(this.access, []);
        this.entity.dashboard = true;
        this.entity.enabled = true;
        this.displayDialog = true;
    }

    showDialogToEdit(event: Event, enty: ProfileModel) {
        this.isView = false;
        this.selectedAccess = [];
        this.find(new ProfileModel().clone(enty));
        event.preventDefault();
    }

    showDialogToView(event: Event, enty: ProfileModel) {
        this.isView = true;
        this.selectedAccess = [];
        this.find(new ProfileModel().clone(enty));
        event.preventDefault();
    }

    onSubmit() {
        this.save(new ProfileModel().clone(this.entity));
    }

    save(enty: ProfileModel) {
        console.log(this.entity);
        this.submitted = true;
        enty.list = this.getAcces(this.selectedAccess);
        const header = new RequestHeaderModel(this.authService.getUser());
        const profileModel1 = new ProfileModelRequestSingle(header, enty);

        if (enty.profileId > 0) {
            this.profileService.merge(profileModel1).subscribe({
                next: (data: ProfileModelResponseSingle) => {
                    this.submitted = false;
                    this.mensajeService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.onList();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        } else {
            this.profileService.persist(profileModel1).subscribe({
                next: (data: ProfileModelResponseSingle) => {
                    this.submitted = false;
                    this.mensajeService.showSuccess(this.translate.instant('succes'));
                    this.displayDialog = false;
                    this.entity = null;
                    this.onList();
                },
                error: error => {
                    this.submitted = false;
                }
            });
        }
    }

    close() {
        this.displayDialog = false;
        this.submitted = false;
    }

    accessToTreeNodes(access: AccessModel[]) {
        access.forEach(a => this.access.push(this.convertToTreeNode(a)));
    }

    accessToTreeNodesSelected(access: AccessModel[]) {
        for (const a of access) {
            this.selectedAccess.push(this.convertToTreeNode(a));
        }
    }

    convertToTreeNode(a: AccessModel): TreeNode {
        const chil: TreeNode[] = [];

        if (a.list != null) {
            for (const c of a.list) {
                chil.push(this.convertToTreeNode(c));
            }
        }
        return {
            label: a.name,
            data: a,
            expanded: true,
            leaf: a.parentId > 0,
            children: chil
        };
    }

    loadSelectAcces(nodes: TreeNode[], accessAsign: AccessModel[]) {
        if (accessAsign === undefined || accessAsign.length === 0) {
            return;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i].leaf && nodes[i].children.length > 0 && nodes[i].children[0].leaf) {
                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < nodes[i].children.length; j++) {
                    const item = this.modelAccess.clone(nodes[i].children[j].data);
                    const searchRecursively = (accessModel: AccessModel, menuId: number): boolean => {
                        if (accessModel.menuId === menuId) {
                            return true;
                        }
                        if (accessModel.list.length > 0) {
                            return accessModel.list.map(
                                (am: AccessModel) => searchRecursively(am, menuId)
                            ).reduce((result: boolean, el: boolean) => result || el);
                        }
                        return false;
                    };

                    if (accessAsign.filter((am: AccessModel) => searchRecursively(am, item.menuId)).length) {
                        if (!this.selectedAccess.includes(nodes[i].children[j])) {
                            nodes[i].children[j].selectable = !this.isView;
                            this.selectedAccess.push(nodes[i].children[j]);
                            // tslint:disable-next-line:prefer-for-of
                            for (let k = 0; k < nodes[i].children[j].children.length; k++) {
                                console.log('NODES', nodes[i].children[j].children);
                                const item2 = this.modelAccess.clone(nodes[i].children[j].children[k].data);
                                if (accessAsign.find(e => e.menuId === item2.menuId)) {
                                    if (!this.selectedAccess.includes(nodes[i].children[j].children[k])) {
                                        nodes[i].children[j].children[k].selectable = !this.isView;
                                        this.selectedAccess.push(nodes[i].children[j].children[k]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (nodes[i].leaf) {
                return;
            }

            this.loadSelectAcces(nodes[i].children, accessAsign);
            const count = nodes[i].children.length;
            let c = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < nodes[i].children.length; j++) {
                if (this.selectedAccess.includes(nodes[i].children[j])) {
                    c++;
                }
                if (nodes[i].children[j].partialSelected) {
                    nodes[i].partialSelected = true;
                }
            }
            if (c === 0) {
            } else if (c === count) {
                nodes[i].partialSelected = false;
                if (!this.selectedAccess.includes(nodes[i])) {
                    nodes[i].selectable = !this.isView;
                    this.selectedAccess.push(nodes[i]);
                }
            } else {
                nodes[i].partialSelected = true;
            }
        }
    }

    getAcces(nodes: TreeNode[]): AccessModel[] {
        const access: AccessModel[] = [];
        for (const node of nodes) {
            this.armyAccess(access, node);
        }
        return access;
    }

    armyAccess(accesos: AccessModel[], nodo: TreeNode) {
        const am = this.modelAccess.clone(nodo.data);
        am.list = null;
        if (!accesos.find(e => e.menuId === am.menuId)) {
            accesos.push(am);
        }

        if (nodo.parent !== undefined) {
            this.armyAccess(accesos, nodo.parent);
        }
    }
}
