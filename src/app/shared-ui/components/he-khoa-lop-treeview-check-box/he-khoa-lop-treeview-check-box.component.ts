import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, Output, EventEmitter, Inject } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { SharedUserApiService } from '@shared-service';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  data: any;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  data: any;
  name: string;
  level: number;
  checked?: boolean;
}

@Component({
  selector: 'he-khoa-lop-treeview-check-box',
  templateUrl: './he-khoa-lop-treeview-check-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeKhoaLopTreeviewCheckBoxComponent implements OnInit, AfterViewInit {
  listAccessLop: any[] = [];
  // listHe: any[] = [];
  // listKhoa: any[] = [];
  // listKhoaHoc: any[] = [];
  // listNganh: any[] = [];
  // listChuyenNganh: any[] = [];
  // listLop: any[] = [];

  idHe: any = 0;
  idKhoa: any = 0;
  khoaHoc: any = 0;
  idChuyenNganh: any = 0;
  listIdLop: any[] = [];

  title = '';

  @Output() readonly heChange = new EventEmitter<any>();
  @Output() readonly khoaChange = new EventEmitter<any>();
  @Output() readonly khoaHocChange = new EventEmitter<any>();
  @Output() readonly chuyenNganhChange = new EventEmitter<any>();
  @Output() readonly lopChange = new EventEmitter<any>();

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    data: node.data,
    level
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private readonly userApiService: SharedUserApiService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    private aclService: ACLService
  ) {
    this.title = this.i18n.fanyi('lop-tree-view.title');
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  permission = {
    isViewAll: false,
    isViewHe: false,
    isViewKhoa: false,
    isViewKhoaHoc: false,
    isViewChuyenNganh: false
  };

  ngOnInit(): void {
    this.userApiService.getUserAccessLop().subscribe({
      next: (res: any) => {
        this.listAccessLop = res.data;
        // console.log(this.listAccessLop);

        // // Bóc tách các thông tin
        // this.listHe = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idHe: item.idHe, he: item.he })))].map(item =>
        //   JSON.parse(item)
        // );
        // log(this.listHe);
        // this.listKhoa = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idKhoa: item.idKhoa, khoa: item.khoa })))].map(item =>
        //   JSON.parse(item)
        // );
        // log(this.listKhoa);
        // this.listKhoaHoc = [
        //   ...new Set(this.listAccessLop.map(item => JSON.stringify({ nienKhoa: item.nienKhoa, nienKhoa: item.nienKhoa })))
        // ].map(item => JSON.parse(item));
        // log(this.listKhoaHoc);
        // this.listNganh = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idNganh: item.idNganh, nganh: item.nganh })))].map(item =>
        //   JSON.parse(item)
        // );
        // log(this.listNganh);
        // this.listChuyenNganh = [
        //   ...new Set(this.listAccessLop.map(item => JSON.stringify({ idChuyenNganh: item.idChuyenNganh, chuyenNganh: item.chuyenNganh })))
        // ].map(item => JSON.parse(item));
        // log(this.listChuyenNganh);
        // this.listLop = [...this.listAccessLop];
        // log(this.listLop);

        const transformedData = this.transformData(this.listAccessLop);
        this.dataSource.setData(transformedData);
        if (this.permission.isViewAll) {
          this.listIdLop = this.listAccessLop.map(x => x.idLop);
        }
        this.lopChange.emit(this.listIdLop);
      },
      error: (err: any) => {},
      complete: () => {}
    });
    this.initRightOfUser();
  }

  initRightOfUser(): void {
    // this.permission.isViewAll = this.aclService.canAbility('VIEW_SV_LOP_ALL');
    this.permission.isViewHe = true;
    this.permission.isViewKhoa = true;
    this.permission.isViewKhoaHoc = true;
    this.permission.isViewChuyenNganh = true;
  }

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const nodeIndex = this.treeControl.dataNodes.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      const potentialParent = this.treeControl.dataNodes[i];
      if (potentialParent.level < node.level) {
        return potentialParent;
      }
    }
    return null;
  }
  onTreeNodeClick(event: any, node: FlatNode): void {
    event.stopPropagation(); // Dừng sự kiện lan ra ngoài
    console.log('Node clicked:', node);

    // Node cha: Cập nhật tất cả node con
    if (this.treeControl.isExpandable(node)) {
      console.log('Node is expandable:', node);
      const descendants = this.treeControl.getDescendants(node);
      console.log('Descendants:', descendants);

      // Toggle trạng thái cha và cập nhật tất cả con theo trạng thái cha
      node.checked = !node.checked;
      descendants.forEach(descendant => (descendant.checked = node.checked));
    } else {
      // Node con: Cập nhật trạng thái của cha
      node.checked = !node.checked;
      const parent = this.getParentNode(node);

      if (parent) {
        const allChecked = this.treeControl.getDescendants(parent).every(descendant => descendant.checked);
        const allUnchecked = this.treeControl.getDescendants(parent).every(descendant => !descendant.checked);

        // Cập nhật trạng thái cha dựa vào trạng thái của tất cả con
        parent.checked = allChecked || !allUnchecked;
      }
    }

    // Lấy danh sách các node được chọn
    const selectedNodes = this.getSelectedNodes();

    // Lọc danh sách selectedNodes theo từng level
    const level0Nodes = selectedNodes.filter(n => n.level === 0);
    const level1Nodes = selectedNodes.filter(n => n.level === 1);
    const level2Nodes = selectedNodes.filter(n => n.level === 2);
    const level3Nodes = selectedNodes.filter(n => n.level === 3);
    const level4Nodes = selectedNodes.filter(n => n.level === 4);

    // Xử lý các node level 0
    if (node.level === 0) {
      this.listIdLop = [];
      this.idHe = node.data?.idHe;
      log(node);
      this.heChange.emit(this.idHe);
      if (this.permission.isViewHe) {
        this.listIdLop = this.listAccessLop.filter((item: any) => level0Nodes.some(n => n.data?.idHe === item.idHe)).map(x => x.idLop);
        this.lopChange.emit(this.listIdLop);
      }
    }

    // Xử lý các node level 1
    if (node.level === 1) {
      this.listIdLop = [];
      this.idHe = node.data?.idHe;
      this.idKhoa = node.data?.idKhoa;
      this.heChange.emit(this.idHe);
      this.khoaChange.emit(this.idKhoa);
      log(node);
      if (this.permission.isViewKhoa) {
        this.listIdLop = this.listAccessLop
          .filter((item: any) => level1Nodes.some(n => n.data?.idHe === item.idHe && n.data?.idKhoa === item.idKhoa))
          .map(x => x.idLop);
        this.lopChange.emit(this.listIdLop);
      }
    }

    // Xử lý các node level 2
    if (node.level === 2) {
      this.listIdLop = [];
      this.idHe = node.data?.idHe;
      this.idKhoa = node.data?.idKhoa;
      this.khoaHoc = node.data?.khoaHoc;
      this.heChange.emit(this.idHe);
      this.khoaChange.emit(this.idKhoa);
      this.khoaHocChange.emit(this.khoaHoc);
      log(node);
      if (this.permission.isViewKhoaHoc) {
        this.listIdLop = this.listAccessLop
          .filter((item: any) =>
            level2Nodes.some(n => n.data?.idHe === item.idHe && n.data?.idKhoa == item.idKhoa && n.data?.khoaHoc === item.khoaHoc)
          )
          .map(x => x.idLop);
        this.lopChange.emit(this.listIdLop);
      }
    }

    // Xử lý các node level 3
    if (node.level === 3) {
      this.listIdLop = [];
      this.idHe = node.data?.idHe;
      this.idKhoa = node.data?.idKhoa;
      this.khoaHoc = node.data?.khoaHoc;
      this.idChuyenNganh = node.data?.idChuyenNganh;
      this.heChange.emit(this.idHe);
      this.khoaChange.emit(this.idKhoa);
      this.khoaHocChange.emit(this.khoaHoc);
      this.chuyenNganhChange.emit(this.idChuyenNganh);
      log(node);

      if (this.permission.isViewChuyenNganh) {
        this.listIdLop = this.listAccessLop
          .filter((item: any) =>
            level3Nodes.some(
              n =>
                n.data?.idHe === item.idHe &&
                n.data?.idKhoa == item.idKhoa &&
                n.data?.khoaHoc === item.khoaHoc &&
                n.data?.idChuyenNganh === item.idChuyenNganh
            )
          )
          .map(x => x.idLop);
        this.lopChange.emit(this.listIdLop);
      }
    }

    // Xử lý các node level 4
    if (node.level === 4) {
      this.idHe = node.data?.idHe;
      this.idKhoa = node.data?.idKhoa;
      this.khoaHoc = node.data?.khoaHoc;
      this.idChuyenNganh = node.data?.idChuyenNganh;
      this.listIdLop = level4Nodes.map(n => n.data?.lop?.idLop);
      this.heChange.emit(this.idHe);
      this.khoaChange.emit(this.idKhoa);
      this.khoaHocChange.emit(this.khoaHoc);
      this.chuyenNganhChange.emit(this.idChuyenNganh);
      this.lopChange.emit(this.listIdLop);
    }
  }

  getSelectedNodes(): FlatNode[] {
    return this.treeControl.dataNodes.filter(node => node.checked);
  }
  getNode(name: string): FlatNode | null {
    return this.treeControl.dataNodes.find(n => n.name === name) || null;
  }

  // Hàm chuyển đổi dữ liệu
  transformData(data: any) {
    const result = [];

    // Tạo một đối tượng để nhóm theo "he", "khoa", "chuyenNganh"
    const grouped: any = {};

    data.forEach((item: any) => {
      const heKey = item.he;
      const khoaKey = item.khoa;
      const chuyenNganhKey = item.chuyenNganh;
      const lopKey = item.tenLop;
      const khoaHocKey = item.khoaHoc;

      // Nhóm theo "he"
      if (!grouped[heKey]) {
        grouped[heKey] = {
          name: `${this.i18n.fanyi('lop-tree-view.he')} ${heKey}`,
          data: { idHe: item.idHe },
          children: []
        };
      }

      // Nhóm theo "khoa"
      let khoaGroup = grouped[heKey].children.find((k: any) => k.name === `${this.i18n.fanyi('lop-tree-view.khoa')} ${khoaKey}`);
      if (!khoaGroup) {
        khoaGroup = {
          name: `${this.i18n.fanyi('lop-tree-view.khoa')} ${khoaKey}`,
          data: { idHe: item.idHe, idKhoa: item.idKhoa },
          children: []
        };
        grouped[heKey].children.push(khoaGroup);
      }

      // Nhóm theo "khóa"
      let khoaHocGroup = khoaGroup.children.find((kh: any) => kh.name === `${this.i18n.fanyi('lop-tree-view.khoa-hoc')} ${khoaHocKey}`);
      if (!khoaHocGroup) {
        khoaHocGroup = {
          name: `${this.i18n.fanyi('lop-tree-view.khoa-hoc')} ${khoaHocKey}`,
          data: { idHe: item.idHe, idKhoa: item.idKhoa, khoaHoc: item.khoaHoc },
          children: []
        };
        khoaGroup.children.push(khoaHocGroup);
      }

      // Nhóm theo "chuyên ngành"
      let chuyenNganhGroup = khoaHocGroup.children.find(
        (cn: any) => cn.name === `${this.i18n.fanyi('lop-tree-view.chuyen-nganh')} ${chuyenNganhKey}`
      );
      if (!chuyenNganhGroup) {
        chuyenNganhGroup = {
          name: `${this.i18n.fanyi('lop-tree-view.chuyen-nganh')} ${chuyenNganhKey}`,
          data: {
            idHe: item.idHe,
            idKhoa: item.idKhoa,
            khoaHoc: item.khoaHoc,
            idChuyenNganh: item.idChuyenNganh
          },
          children: []
        };
        khoaHocGroup.children.push(chuyenNganhGroup);
      }

      // Thêm lớp vào chuyên ngành
      let lopGroup = {
        name: lopKey,
        data: { idHe: item.idHe, idKhoa: item.idKhoa, khoaHoc: item.khoaHoc, idChuyenNganh: item.idChuyenNganh, lop: item },
        children: []
      };
      chuyenNganhGroup.children.push(lopGroup);
    });

    // Chuyển đổi đối tượng nhóm thành mảng kết quả
    for (const he in grouped) {
      result.push(grouped[he]);
    }

    return result;
  }
}
